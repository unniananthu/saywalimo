import React, { useEffect, useState } from "react";
import Ripple from "react-ripples";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import { GiSteeringWheel } from "react-icons/gi";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MapIcon from "@mui/icons-material/Map";
import { Link, NavLink } from "react-router-dom";
import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Logout from "@mui/icons-material/Logout";
import { instance } from "../Const/ApiHeader";
import { GET_NOTIFICATIONS } from "../Const/ApiConst";
import logo from "../Imges/Asset 2.png";
import { IoMdMenu, IoMdSettings } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toggleMenuState } from "../store/SideMenu/SideMenuState";
import { useSelector } from "react-redux";
import { IoIosCloseCircle } from "react-icons/io";
import { MdCardTravel } from "react-icons/md";

function Sidebar() {
  const dispatch = useDispatch();

  const { menuState } = useSelector((state) => state?.menuState);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const userName = sessionStorage.getItem("umn");
  const des = sessionStorage.getItem("des");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);

  const open_notification_menu = Boolean(anchorElNotification);
  const handle_click_notification_menu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handle_close_notification_menu = () => {
    setAnchorElNotification(null);
  };

  const open_profile_menu = Boolean(anchorEl);
  const handle_click_profile_menu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_profile_menu = () => {
    setAnchorEl(null);
  };

  const LogoutAction = () => {
    sessionStorage.removeItem("wsstfaarvav");
    sessionStorage.removeItem("umn");
    window.location.reload();
  };

  const logoImage = {
    width: "100%",
  };

  // setTimeout(() => {
  //     loadData()
  // }, 3000);

  const loadData = async () => {
    await instance.get(GET_NOTIFICATIONS).then((response) => {
      setNotificationCount(response.data.count);
      setNotifications(response.data.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const expandMenu = () => {
    dispatch(toggleMenuState(true));
  };

  return (
    <>
      <nav className="nav-menu">
        <div className="w-100 menu-icon">
          <IoMdMenu onClick={() => expandMenu()} />
        </div>
        <div className="d-flex gap-2">
          <div className="topbar-icon-container">
            {/* <IconButton
              onClick={handle_click_notification_menu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={
                open_notification_menu ? "account-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={open_notification_menu ? "true" : undefined}
            >
              <Badge badgeContent={notificationCount} color="warning">
                <NotificationsNoneIcon className="topbar-icon" />
              </Badge>
            </IconButton> */}
            <Menu
              anchorEl={anchorElNotification}
              id="account-menu"
              open={open_notification_menu}
              onClose={handle_close_notification_menu}
              onClick={handle_close_notification_menu}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: "360px",
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
              {/* <MenuItem>
                                <div className='d-flex flex-column text-secondary'>
                                    <strong>Notifications</strong>
                                    <div>You have 2 unread messages</div>
                                </div>
                            </MenuItem>
                            <Divider /> */}

              {notifications.map((res, i) => (
                <MenuItem>
                  <div className="d-flex flex-column text-secondary">
                    <strong>
                      {res.notificationTitle + " - " + res.tripNo}
                    </strong>
                    <div>{res.notificationTitle}</div>
                  </div>
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div>
            <IconButton
              onClick={handle_click_profile_menu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open_profile_menu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open_profile_menu ? "true" : undefined}
            >
              <Avatar sx={{ bgcolor: "red", width: 30, height: 30 }}>A</Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open_profile_menu}
              onClose={handle_close_profile_menu}
              onClick={handle_close_profile_menu}
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
              {/* <MenuItem onClick={handle_close_profile_menu}>
                <Avatar /> Profile
              </MenuItem> */}
              <Divider />
              <MenuItem onClick={LogoutAction}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </nav>
      <aside
        style={{
          display:
            window.innerWidth > 700 ? "bloc" : menuState ? "block" : "none",
          zIndex: 99,
        }}
        onClick={() => {
          dispatch(toggleMenuState(false));
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: "#000",
            padding: "15px",
          }}
        >
          <Link to={"/"}>
            {" "}
            <img src={logo} alt="" style={logoImage} />
          </Link>
        </div>

        <div className="menu-icon mt-2 w-100">
          <IoIosCloseCircle
            onClick={() => dispatch(toggleMenuState(!menuState))}
            style={{ fontSize: "30px", float: "right" }}
            color="red"
          />
        </div>
        <div className="user-container mt-4">
          <div>
            {" "}
            <Avatar sx={{ bgcolor: "red" }}>{userName[0]}</Avatar>{" "}
          </div>
          <div className="d-flex flex-column">
            <strong>{userName}</strong>
            <small>{des}</small>
          </div>
        </div>
        <ul className="sidebarMenu mt-4">
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <ComputerIcon />
                <div>Dashboard</div>
              </NavLink>
            </Ripple>
          </li>
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/drivers"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <GiSteeringWheel />
                <div>Drivers</div>
              </NavLink>
            </Ripple>
          </li>
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/Clients"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <PersonIcon />
                <div>Clients</div>
              </NavLink>
            </Ripple>
          </li>
          {/* <li>
                        <Ripple className='menuItemContainer'>
                            <NavLink to='/Categories' className={({ isActive }) => isActive ? "menuItem menuItem-active" : "menuItem"}>
                                <LocalOfferIcon />
                                <div>Categories</div>
                            </NavLink>
                        </Ripple>
                    </li> */}
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/Vehicles"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <DirectionsCarIcon />
                <div>Vehicle</div>
              </NavLink>
            </Ripple>
          </li>
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/trips"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <MapIcon />
                <div>Trips</div>
              </NavLink>
            </Ripple>
          </li>

          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/new_trips"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <MapIcon />
                <div>Add new trip</div>
              </NavLink>
            </Ripple>
          </li>
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/packages"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <MdCardTravel size={30} />
                <div>Packages</div>
              </NavLink>
            </Ripple>
          </li>
          <li>
            <Ripple
              className="menuItemContainer"
              onClick={() => {
                dispatch(toggleMenuState(false));
              }}
            >
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "menuItem menuItem-active" : "menuItem"
                }
              >
                <IoMdSettings size={30} />
                <div>Price & Distance Settings</div>
              </NavLink>
            </Ripple>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
