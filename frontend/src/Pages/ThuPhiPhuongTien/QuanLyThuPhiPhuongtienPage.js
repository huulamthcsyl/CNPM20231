import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, TextField, Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead, TableContainer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from "@mui/system";
import { DatePicker } from '@mui/x-date-pickers';
import { Autocomplete } from "@mui/material";
import ClassApi from "../../Api/Api";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { VehicleReceipt } from '../../Models/VehicleReceipt';

function QuanLyThuPhiPhuongtienPage() {
  const columnNames = ["Số thứ tự", "Tên khoản thu", "Số tiền (đồng)", "Ghi chú"];

  //const [vehicleID, setVehicleID] = useState('');
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [dateCreated, setDateCreated] = useState();
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [description, setDescription] = useState("");
  const [vehicleId, setVehicleID] = useState("");
  const feeShrinkList = [];

  const CustomizedDatePicker = styled(DatePicker)`
    & .MuiInputBase-input {
      font-size: 18px;
      width: 445px;
    }
    .MuiInputLabel-root {
      font-size: 20px;
    }
  `;

  useEffect(() => {
    ClassApi.GetAllVehicles()
      .then((res) => {
        setVehicleList(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
    ClassApi.GetAllVehicleFees()
      .then((res) => {
        setFees(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  }, []);

  fees.map((fee, index) => {
    feeShrinkList.push({
      label: fee.name,
      cost: fee.cost,
      vehicleFeeId: fee.vehicleFeeId,
    });
  });
  const handleChangeVehicle = (event, value) => {
    setSelectedVehicle(value);
    setVehicleID(value.vehicleId);
    console.log(value);
  };

  const handleAddPayment = () => {
    setPayments([...payments, { label: "", cost: "", vehicleFeeId: "" }]);
  };
  const handleDeletePayment = (id) => {
    const updatePayments = payments.filter((_, index) => index !== id);
    if (payments[id].cost !== "")
      setTotalCost(totalCost - parseInt(payments[id].cost));

    setPayments(updatePayments);
  };
  const handleChangeFee = (index) => (event, value) => {
    let newPayments = [...payments];
    if (value !== null) {
      newPayments[index] = {
        label: value.label,
        cost: String(value.cost),
        vehicleFeeId: value.vehicleFeeId,
      };
      if (payments[index].cost !== "")
        setTotalCost(totalCost - parseInt(payments[index].cost) + value.cost);
      else setTotalCost(totalCost + value.cost);
    } else {
      newPayments[index] = { label: "", cost: "", vehicleFeeId: "" };
      setTotalCost(totalCost - parseInt(payments[index].cost));
    }
    setPayments(newPayments);
  };
  const handleChangeCost = (index) => (event, value) => {
    let newPayments = [...payments];

    let newCost = parseInt(event.target.value);

    if (newCost !== 0) {
      newPayments[index].cost = String(newCost);
    } else {
      newPayments[index].cost = "";
    }
    setPayments(newPayments);
    let newTotalCost = 0;
    if (payments.length > 0) {
      payments.map((payment, index) => {
        if (payment.cost !== "") newTotalCost += parseInt(payment.cost);
      });
      setTotalCost(newTotalCost);
    } else setTotalCost(0);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (dateCreated === undefined || !dateCreated.isValid()) {
      toast.error("Ngày thu không hợp lệ!");
      return;
    }
    if (totalCost === 0) {
      toast.error("Vui lòng thêm khoản thu!");
      return;
    }

    var dateCreatedJson = new Date(dateCreated);
    dateCreatedJson.setDate(dateCreatedJson.getDate() + 1);
    dateCreatedJson = JSON.stringify(dateCreatedJson);
    dateCreatedJson = dateCreatedJson.slice(1, dateCreatedJson.length - 1);
    let vehiclePayments = [];
    payments.map((payment) => {
      vehiclePayments.push({
        vehicleFeeId: payment.vehicleFeeId,
        amount: parseInt(payment.cost),
      });
    });
    const newVehicleReceipt = new VehicleReceipt(
      vehicleId,
      dateCreated,
      totalCost,
      description,
      vehiclePayments,
    );
    console.log(newVehicleReceipt);
    ClassApi.PostVehicleReceipt(newVehicleReceipt)
      .then((res) => {
        toast.success("Tạo phiếu thu thành công!");
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2} padding={"50px"}>
        <Grid item xs={12}>
          <h1 style={{ fontSize: "40px" }}>
            Thu phí phương tiện
          </h1>
        </Grid>
        <Grid item>
          <form onSubmit={handleSubmit}>
            <Grid item container direction="row" alignItems="center">
              <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
                Biển kiểm soát
              </Typography>
              <Autocomplete
                disablePortal
                autoHighlight
                options={vehicleList}
                getOptionLabel={(option) => option.licensePlate || ''}
                value={selectedVehicle}
                onChange={handleChangeVehicle}
                sx={{
                  "& .MuiAutocomplete-input": {
                    fontSize: 20,
                  },
                  width: 500,
                }}
                renderInput={(params) => (
                  <TextField {...params} />
                )}
              />
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item container direction="row" alignItems="center">
                <Typography style={{ fontSize: "24px", marginRight: "28px" }}>
                  Ngày thu
                </Typography>
                <CustomizedDatePicker
                  sx={{ marginLeft: "60px" }}
                  value={dateCreated}
                  onChange={(date) => setDateCreated(date)}
                  format="DD-MM-YYYY"
                ></CustomizedDatePicker>
              </Grid>
            </LocalizationProvider>

            <Grid item xs={12}>
              <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
                Danh sách khoản thu
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table
                  sx={{
                    minWidth: 650,
                    "& .MuiTableCell-root": {
                      border: "1px solid black",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {columnNames.map((name, index) => (
                        <TableCell key={index}>
                          <Typography variant="h4" style={{ fontWeight: "bold" }}>
                            {name}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments && payments.map((payment, index) => (
                      <TableRow>
                        <TableCell style={{ fontSize: "18px" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          <Autocomplete
                            disablePortal
                            autoHighlight
                            options={feeShrinkList}
                            onChange={handleChangeFee(index)}
                            sx={{
                              "& .MuiAutocomplete-input": {
                                fontSize: 20,
                              },
                              width: 500,
                            }}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.label}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label=""
                                required={true}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "18px", width: "360px" }}
                        >
                          <TextField
                            inputProps={{
                              style: { fontSize: "18px" },
                              required: true,
                            }}
                            value={payment.cost}
                            onChange={handleChangeCost(index)}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDeletePayment(index)}
                            style={{ fontSize: "18px", color: "red" }}
                          >
                            Xóa
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        style={{ color: "red", fontSize: "24px" }}
                      >
                        Tổng số tiền
                      </TableCell>
                      <TableCell colSpan={2} style={{ fontSize: "20px" }}>
                        <TextField
                          inputProps={{
                            style: { fontSize: "18px" },
                            readOnly: true,
                          }}
                          value={totalCost.toLocaleString("en-US", {
                            style: "decimal",
                          })}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography>
                <button
                  onClick={() => handleAddPayment()}
                  style={{ fontSize: "18px", color: "red" }}
                >
                  Thêm
                </button>
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center" >
              <Typography style={{ fontSize: "24px", marginRight: "46px" }}>
                Ghi chú
              </Typography>
              <TextField
                style={{ width: "500px" }}
                inputProps={{ style: { fontSize: "18px" } }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></TextField>
            </Grid>

            {/* <Grid item>
              <NavLink to="/thuphiphuongtien">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#79C9FF", margin: "30px 0px" }}
                >
                  <Typography variant="h4" style={{ color: "black" }}>
                    Xác nhận
                  </Typography>
                </Button>
              </NavLink>
            </Grid> */}

            <Grid item>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#79C9FF", margin: "30px 0px", fontSize: "20px",
                  color: "black",
                }}
                type='submit'
                size="large"
              >
                Xác nhận
              </Button>
              <NavLink to="/thuphiphuongtien">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#79C9FF", marginLeft: "30px", fontSize: "20px",
                    color: "black",
                  }}
                  size="large"

                >
                  Hủy
                </Button>
              </NavLink>
            </Grid>
          </form>
        </Grid>
      </Grid >
    </LocalizationProvider >
  );
}

export default QuanLyThuPhiPhuongtienPage;
