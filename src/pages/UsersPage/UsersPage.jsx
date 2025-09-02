import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { PALETTE } from "../../common/palette";
import { UserCard } from "../../components/UserCard/UserCard";
import { getUsers } from "../../services/UsersService";
import "./usersPage.css";

const PAGE_SIZE = 10;

export const UsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [usersList, setUsersList] = useState([]);
  const [count, setCount] = useState(0);
  const [activeSuscribedCount, setActiveSuscribedCount] = useState(0);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userSelected, setUserSelected] = useState();
  const [rowFocused, setRowFocused] = useState();

  const fetchData = async (e, settedPage) => {
    if (e) e.preventDefault();
    setLoading(true);
    settedPage = settedPage ?? page;
    try {
      const { data } = await getUsers(search, settedPage);
      setPage(settedPage);
      setUsersList(data.data);
      setCount(data.count);
      setActiveSuscribedCount(data.activeSuscribedCount);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onUserUpdate = (user) => {
    const copy = [...usersList];
    const index = copy.findIndex((x) => x._id === user._id);
    copy[index] = { ...user };
    setUsersList(copy);
  };

  const onUserRemove = (user) => {
    const copy = [...usersList];
    const index = copy.findIndex((x) => x._id === user._id);
    copy.splice(index, 1);
    setUsersList(copy);
    setUserModalOpen(false);
  };

  const goToPage = (page) => {
    fetchData(null, page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ margin: "10px" }}>Manejo de Alumnos</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <form
          onSubmit={fetchData}
          style={{
            margin: "10px",
            width: "90%",
            maxWidth: "350px",
            border: `2px solid ${PALETTE.quaternaryColor}`,
            borderRadius: "10px",
            display: "flex",
          }}
        >
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "1em",
              width: "100%",
              maxWidth: "350px",
            }}
            fullWidth
            placeholder="Buscar..."
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            color="secondary"
            onClick={fetchData}
          >
            {loading === true ? <CircularProgress size={24} /> : <SearchIcon />}
          </IconButton>
        </form>
        <Grid
          sx={{ justifyContent: "end", alignItems: "center" }}
          item
          container
        >
          <span className="poppins-regular">
            Alumnos Totales: <span className="poppins-bold">{count}</span>
          </span>
        </Grid>
        <Grid
          sx={{ justifyContent: "end", alignItems: "center" }}
          item
          container
        >
          <span className="poppins-regular">
            {"Suscripciones Activas: "}
            <span className="poppins-bold">{activeSuscribedCount}</span>
          </span>
        </Grid>
        <Grid
          sx={{ justifyContent: "end", alignItems: "center" }}
          item
          container
        >
          <IconButton
            disabled={page == 1 || loading}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeftIcon />
          </IconButton>
          <div>
            Página {page} / {Math.ceil(count / PAGE_SIZE)}
          </div>
          <IconButton
            disabled={page == Math.ceil(count / PAGE_SIZE) || loading}
            onClick={() => goToPage(page + 1)}
          >
            <ChevronRightIcon />
          </IconButton>
        </Grid>
      </div>
      {error && (
        <p style={{ margin: "20px", color: "red" }}>Ocurrió un error</p>
      )}
      {usersList?.length > 0 && (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="right">Acceso Hasta</TableCell>
                  <TableCell align="right">Máxima Unidad</TableCell>
                  <TableCell align="right">Navegación Libre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody onMouseLeave={() => setRowFocused(null)}>
                {usersList.map((row, iRow) => (
                  <TableRow
                    key={iRow}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: rowFocused == iRow ? "lightcyan" : "",
                      cursor: "pointer",
                      border:
                        row.subscriptionID &&
                        row.nextBillingTime &&
                        "3px solid #CFB53B",
                    }}
                    onMouseEnter={() => setRowFocused(iRow)}
                    onClick={() => {
                      setUserSelected(row);
                      setUserModalOpen(true);
                    }}
                  >
                    <TableCell align="center">
                      {new Date(row.subscriptionValidUntil).getTime() >
                        Date.now() && (
                        <WorkspacePremiumIcon
                          style={{ color: "#CFB53B" }}
                          fontSize="medium"
                        />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">
                      {row.subscriptionValidUntil?.length > 3 &&
                      new Date(row.subscriptionValidUntil).getTime() >
                        Date.now()
                        ? moment(row.subscriptionValidUntil).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="right">{row.boughtUpTo}</TableCell>
                    <TableCell align="right">
                      {row.freeNavigation ? "Si" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Modal
        open={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setUserSelected(undefined);
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setUserModalOpen(false);
            setUserSelected(undefined);
          }}
        >
          <UserCard
            user={userSelected}
            onUpdate={onUserUpdate}
            onRemove={onUserRemove}
          />
        </div>
      </Modal>
    </div>
  );
};
