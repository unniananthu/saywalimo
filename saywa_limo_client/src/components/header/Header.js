import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import companyLogo from "../../images/Asset1.png";
import Logout from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../const/Firebase";
import Login from "../login/Login";
import HomeIcon from "@mui/icons-material/Home";
import Cookies from "js-cookie";
import "./header.css";
import { useSelector } from "react-redux";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { instance } from "../../const/ApiHeader";
import { GET_WALLET_BALANCE } from "../../const/ApiConst";
import { IoMdRefresh } from "react-icons/io";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 2,
};

function Header() {
  const Navigate = useNavigate();
  const topbarStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "#000",
    colorl: "#fff",
  };
  const topbarLogoStyle = {
    height: "60px",
  };

  const { authRefreshs } = useSelector((state) => state?.authRefresh);

  // eslint-disable-next-line
  const [photo, setPhoto] = useState(false || Cookies.get("photoURL"));

  useEffect(() => {
    if (authRefreshs) {
      setPhoto(Cookies.get("photoURL"));
    }
    if (!authRefreshs) {
      handleCloseModal();
    }
  }, [authRefreshs]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    loadWalletBalance();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutAction = async () => {
    await signOut(auth).then((res) => {
      Cookies.remove("photoURL");
      Cookies.remove("udtl");
      sessionStorage.clear();
      Navigate("/");
      window.location.reload();
    });
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    if (authRefreshs) {
      setPhoto(Cookies.get("photoURL"));
    }
  }, [authRefreshs]);

  useEffect(() => {
    loadWalletBalance();
  }, []);

  const loadWalletBalance = async () => {
    try {
      const data = {
        cust_id: JSON.parse(Cookies.get("udtl")).uid,
      };
      instance.post(GET_WALLET_BALANCE, data).then((result) => {
        const balance = result.data;
        setWalletBalance(balance[0]?.wallet_balance);
      });
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <div style={topbarStyle}>
      <div style={topbarStyle}>
        <Link to="/">
          <div className="text-white">
            <img src={companyLogo} alt="" style={topbarLogoStyle} />
          </div>
        </Link>
        {/* <div className="header-menu">
          <div>Home</div>
          <div>About</div>
          <div>Service</div>
          <div>Fleet</div>
          <div>Team</div>
          <div>Contact</div>
          <div>Book Now</div>
        </div> */}

        <React.Fragment>
          {photo ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {Cookies.get("photoURL") === "No Image" ? (
                    <Avatar alt="Remy Sharp">
                      {JSON.parse(Cookies.get("udtl"))?.fullName?.charAt(0)}
                    </Avatar>
                  ) : (
                    <Avatar alt="Remy Sharp" src={Cookies.get("photoURL")} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Button
              size="small"
              variant="contained"
              style={{
                background: "#c59c6c",
                color: "#fff",
                padding: "5px 10px",
              }}
              onClick={() => handleOpenModal()}
            >
              Sign in
            </Button>
          )}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                width: "200px",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link to="/">
              <MenuItem
                onClick={handleClose}
                style={{ fontSize: "14px", color: "#808080" }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <strong> Home</strong>
              </MenuItem>
            </Link>
            <Link to="/Profile">
              <MenuItem
                onClick={handleClose}
                style={{ fontSize: "14px", color: "#808080" }}
              >
                <ListItemIcon>
                  <CgProfile />
                </ListItemIcon>
                <strong> Profile</strong>
              </MenuItem>
            </Link>
            <Link to="/rides">
              <MenuItem
                onClick={handleClose}
                style={{ fontSize: "14px", color: "#808080" }}
              >
                <ListItemIcon>
                  <DriveEtaIcon />
                </ListItemIcon>
                <strong>Rides</strong>
              </MenuItem>
            </Link>
            <Link to="/refer_and_earn" style={{ color: "#808080" }}>
              <MenuItem onClick={handleClose} style={{ fontSize: "14px" }}>
                <ListItemIcon>
                  <FaHandHoldingDollar />
                </ListItemIcon>
                <strong> Refer & Earn</strong>
              </MenuItem>
            </Link>
            <MenuItem
              // onClick={handleClose}
              style={{ fontSize: "14px", color: "#808080" }}
            >
              <ListItemIcon>
                <FaWallet />
              </ListItemIcon>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <strong> Wallet</strong>
                <small>
                  ${" "}
                  {walletBalance === null ||
                  walletBalance === "" ||
                  walletBalance === undefined
                    ? 0
                    : walletBalance}
                </small>
                <IoMdRefresh onClick={loadWalletBalance} />
              </div>
            </MenuItem>

            <Divider />
            <MenuItem
              onClick={() => logoutAction()}
              style={{ fontSize: "14px", color: "#808080" }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <strong>Logout</strong>
            </MenuItem>
          </Menu>
        </React.Fragment>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Login />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Header;
