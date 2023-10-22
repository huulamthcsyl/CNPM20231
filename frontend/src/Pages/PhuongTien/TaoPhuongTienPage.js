import React from 'react'
import { Grid, Button, Typography } from "@mui/material";
import {TextField} from "@mui/material";
function TaoPhuongTienPage() {
  return (
    
    // <Grid item xs={12}>
    //       <h1 style={{ fontSize: "48px" }}> Thêm phương tiện mới </h1>
    // </Grid>
    <Grid container spacing={2} padding={"50px"}>
        <Grid item xs={12}>
          <h1 style={{ fontSize: "40px" }}>Thêm phương tiện mới</h1>
        </Grid>
        <Grid item container direction="row" alignItems="center">
          <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
            Biển kiểm soát
          </Typography>
          <TextField
            style={{ width: "500px" }}
            inputProps={{ style: { fontSize: "18px" } }}
          ></TextField>
        </Grid>
        <Grid item container direction="row" alignItems="center">
          <Typography style={{ fontSize: "24px", marginRight: "110px" }}>
            Loại xe
          </Typography>
          <TextField
            style={{ width: "500px" }}
            inputProps={{ style: { fontSize: "18px" } }}
          ></TextField>
        </Grid>
        <Grid item container direction="row" alignItems="center">
          <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
            Chủ sở hữu
          </Typography>
          <TextField
            style={{ width: "500px" }}
            inputProps={{ style: { fontSize: "18px" } }}
          ></TextField>
        </Grid>
        <Button
            variant="contained"
            style={{ backgroundColor: "#79C9FF", margin: "30px 0px" }}
          >
            <Typography variant="h4" style={{ color: "black" }}>
              Xác nhận
            </Typography>
        </Button>
    </Grid>
  )
}

export default TaoPhuongTienPage