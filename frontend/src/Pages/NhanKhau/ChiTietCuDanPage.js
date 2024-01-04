import {
  Button,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ButtonSearch from "../../Layout/component/ButtonSearch";
import { NavLink, useParams } from "react-router-dom";
import ClassApi from "../../Api/Api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { toast } from "react-toastify";
import vi from "date-fns/locale/vi";

const API_ADDRESS = "https://provinces.open-api.vn/";
const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontWeight: "500",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          //padding: "0px 30px",
          width: "430px",
          "& .MuiInputBase-input": {
            fontSize: "20px",
            padding: "5px",
          },
        },
      },
    },
  },
});
const CustomizedDatePicker = styled(DatePicker)`
  & .MuiInputBase-input {
    font-size: 18px;
    width: 150px;
    height: 40px;
  }
  .MuiInputLabel-root {
    font-size: 20px;
  }
`;
function ThemCuDan() {
  const [person, setPerson] = useState({
    name: "",
    gender: true,
    residenceId: "",
    status: "Thường trú",
    dateOfBirth: "2021-05-04T00:00:00",
    province: "Hà Nội",
    district: "Quận Hai Bà Trưng",
    village: "Phường Bách Khoa",
    ownerRelationship: "Chủ nhà",
    phoneNumber: "",
    identityCardNumber: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [status, setStatus] = useState(person.status);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const [gender, setGender] = useState(person.gender);
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const [province, setProvince] = useState(person.province);
  const [birth, setBirth] = useState(dayjs("2021-05-04T00:00:00"));
  const [addr, setAddr] = useState("");
  const [resid, setResid] = useState("");
  const [relation, setRelation] = useState("");
  const handleChange2 = (event) => {
    setProvince(event.target.value);
    setVillages([]);
  };
  const [district, setDistrict] = useState(person.district);

  const handleChange3 = (event) => {
    setDistrict(event.target.value);
  };
  const [village, setVillage] = useState(person.village);

  const handleChange4 = (event) => {
    setVillage(event.target.value);
  };
  const [name, setName] = useState(person.name);
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const [phoneNumber, setPhoneNumber] = useState(person.phoneNumber);
  const [cccd, setCccd] = useState(person.identityCardNumber);
  const param = useParams();
  useEffect(() => {
    ClassApi.GetInfoPerson(param.id).then((response) => {
      setName(response.data.name);
      setGender(response.data.gender);
      setCccd(response.data.identityCardNumber);
      setStatus(response.data.status);
      setBirth(dayjs(response.data.dateOfBirth));
      console.log(dayjs(response.data.dateOfBirth));
      console.log(response.data.dateOfBirth);
      setPhoneNumber(response.data.phoneNumber);
      setResid(response.data.residenceId);
      setRelation(response.data.ownerRelationship);
      let address = response.data.homeTown.split(",");
      setProvince(address[2].trim());
      setAddr(address);
    });
  }, []);
  const handleChangeInfo = () => {
    if (name == null || name == "") {
      toast.warn("Hãy nhập họ và tên!");
      return;
    }
    if (status == null || status == "") {
      toast.warn("Hãy chọn trạng thái cư trú!");
      return;
    }
    if (birth == null || birth == "") {
      toast.warn("Hãy chọn ngày sinh!");
      return;
    }
    if (province == null || province == "" || provinces.length == 0) {
      toast.warn("Hãy chọn tỉnh thành!");
      return;
    }
    if (district == null || district == "" || districts.length == 0) {
      toast.warn("Hãy chọn quận huyện!");
      return;
    }
    if (village == null || village == "" || villages.length == 0) {
      toast.warn("Hãy chọn xã-phường!");
      return;
    }
    ClassApi.PutPerson({
      personId: param.id,
      name: name,
      residenceId: resid,
      dateOfBirth: birth,
      identityCardNumber: cccd,
      gender: gender,
      phoneNumber: phoneNumber,
      homeTown: village + ", " + district + ", " + province,
      ownerRelationship: relation,
      status: status,
    })
      .then(() => {
        toast.success("Sửa thông tin thành công");
      })
      .catch(() => {
        toast.error("Lỗi");
      });
  };
  useEffect(() => {
    axios.get(API_ADDRESS + "api/?depth=1").then((response) => {
      setProvinces(response.data);
    });
  }, []);
  useEffect(() => {
    if (province) {
      axios.get(API_ADDRESS + "api/p/search/?q=" + province).then((res) => {
        // console.log(provin)
        axios
          .get(API_ADDRESS + "api/p/" + res.data[0].code + "?depth=2")
          .then((response) => {
            setDistricts(response.data.districts);
            //  setDistrict(addr[1].trim())
          })
          .finally(() => {
            if (addr) {
              setDistrict(addr[1].trim());
            }
          });
      });
    }
  }, [province]);
  useEffect(() => {
    if (district) {
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.get(API_ADDRESS + "api/d/search/?q=" + district).then((res) => {
        axios
          .get(API_ADDRESS + "api/d/" + res.data[0].code + "?depth=2")
          .then((response) => {
            setVillages(response.data.wards);
          })
          .finally(() => {
            if (addr) {
              setVillage(addr[0].trim());
            }
          });
      });
    }
  }, [district]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Grid container spacing={1} style={{ padding: "50px" }}>
        <ThemeProvider theme={theme}>
          <Grid item xs={12}>
            <Typography variant="h1" fontSize={48}>
              Chi tiết cư dân
            </Typography>
          </Grid>
          <Grid
            item
            container
            xs={12}
            alignItems="center"
            wrap="wrap"
            //        columnSpacing={8}
          >
            <Grid item xs={2.5}>
              <Typography variant="h4">
                Họ và tên<span style={{ color: "red" }}> (*)</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                onChange={handleChangeName}
                value={name}
                style={{ width: "280px" }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            direction="row"
            wrap="wrap"
            alignItems="center"
          >
            <Grid
              item
              container
              xs={12}
              wrap="nowrap"
              alignItems="center"
              style={{ marginTop: "10px", marginBottom: "16px" }}
            >
              <Grid item xs={2} style={{ marginRight: "48px" }}>
                <Typography variant="h4">
                  Giới tính<span style={{ color: "red" }}> (*)</span>
                </Typography>
              </Grid>
              <RadioGroup
                name="radio-buttons-group"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                style={{ display: "inline" }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label=<Typography variant="h4" fontWeight={400}>
                    Nam
                  </Typography>
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label=<Typography variant="h4" fontWeight={400}>
                    Nữ
                  </Typography>
                />
              </RadioGroup>
            </Grid>
            <Grid item container alignItems="center" xs={6} spacing={2}>
              <Grid item>
                <Typography variant="h4">
                  Trạng thái cư trú<span style={{ color: "red" }}> (*)</span>
                </Typography>
              </Grid>
              <Grid item style={{ marginLeft: "32px" }}>
                {status == "Tạm Vắng" ? (
                  <Select
                    labelId="demo-select-small-label"
                    value="Tạm Vắng"
                    style={{ width: "280px" }}
                    placeholder="trang thai"
                    onChange={handleChange}
                    disabled
                  >
                    <MenuItem value="Tạm Vắng">
                      <Typography variant="h5">Tạm vắng</Typography>
                    </MenuItem>
                  </Select>
                ) : (
                  <Select
                    labelId="demo-select-small-label"
                    value={status}
                    style={{ width: "280px" }}
                    placeholder="trang thai"
                    onChange={handleChange}
                  >
                    <MenuItem value="Thường trú">
                      <Typography variant="h5">Thường trú</Typography>
                    </MenuItem>
                    <MenuItem value="Tạm trú">
                      <Typography variant="h5">Tạm trú</Typography>
                    </MenuItem>
                  </Select>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Grid item xs={2.5}>
              <Typography variant="h4">
                Ngày sinh<span style={{ color: "red" }}> (*)</span>
              </Typography>
            </Grid>
            <Grid item>
              <CustomizedDatePicker
                sx={{
                  marginRight: "35px",
                  width: "280px",
                  // paddingTop: "10px",
                }}
                value={birth}
                onChange={(value) => {
                  setBirth(value);
                }}
                format="DD-MM-YYYY"
              />
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item container xs={12} alignItems="center" style={{marginBottom: "15px"}}>
              <Grid item xs={2.5}>
                <Typography variant="h4">
                  Tỉnh (Thành phố)<span style={{ color: "red" }}> (*)</span>
                </Typography>
              </Grid>
              <Grid item>
                <Select
                  labelId="select-province"
                  value={province}
                  style={{ width: "280px" }}
                  onChange={handleChange2}
                >
                  {provinces.map((provinc, index) => (
                    <MenuItem value={provinc.name} key={index}>
                      <Typography variant="h5">{provinc.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              spacing={3}
              style={{marginBottom: "10px"}}
            >
              <Grid item xs={2}>
                <Typography variant="h4">
                  Huyện (Quận)<span style={{ color: "red" }}> (*)</span>
                </Typography>
              </Grid>
              <Grid item style={{ marginLeft: "43px" }}>
                <Select
                  labelId="select-district"
                  value={district}
                  style={{ width: "280px" }}
                  onChange={handleChange3}
                >
                  {districts.map((distric, index) => (
                    <MenuItem value={distric.name} key={index}>
                      <Typography variant="h5">{distric.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            container
            wrap="nowrap"
            alignItems="center"
            style={{marginBottom: "10px"}}
            //     spacing={3}
          >
            <Grid item xs={2.5}>
              <Typography variant="h4">
                Xã (Phường)<span style={{ color: "red" }}> (*)</span>
              </Typography>
            </Grid>
            <Grid item>
              <Select
                labelId="select-village"
                value={village}
                style={{ width: "280px" }}
                onChange={handleChange4}
              >
                {villages.map((villag, index) => (
                  <MenuItem value={villag.name} key={index}>
                    <Typography variant="h5">{villag.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            alignItems="center"
            wrap="wrap"
            style={{marginBottom: "10px"}}
            //     columnSpacing={12}
          >
            <Grid item xs={2.5}>
              <Typography variant="h4">CCCD</Typography>
            </Grid>
            <Grid item>
              <TextField
                value={cccd}
                onChange={(e) => {
                  setCccd(e.target.value);
                }}
                style={{ width: "280px" }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            alignItems="center"
            wrap="wrap"
            //        columnSpacing={3}
          >
            <Grid item xs={2.5}>
              <Typography variant="h4">Số điện thoại</Typography>
            </Grid>
            <Grid item>
              <TextField
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                style={{ width: "280px" }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid xs={2}>
            <ButtonSearch
              title="Xác nhận"
              border="none"
              onclick={handleChangeInfo}
            ></ButtonSearch>
          </Grid>
          <Grid>
            <NavLink to="/nhankhau">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#f48888",
                  //  width: "120px",
                  margin: "30px 0px",
                }}
              >
                <Typography
                  variant="h4"
                  style={{ color: "black", fontWeight: "400" }}
                >
                  Quay lại
                </Typography>
              </Button>
            </NavLink>
          </Grid>
        </ThemeProvider>
      </Grid>
    </LocalizationProvider>
  );
}

export default ThemCuDan;
