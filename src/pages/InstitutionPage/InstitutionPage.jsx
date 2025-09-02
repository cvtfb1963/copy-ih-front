import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, IconButton, InputBase } from "@mui/material";
import { useEffect, useState } from "react";
import { PALETTE } from "../../common/palette";
import { InstitutionCard } from "../../components/InstitutionCard/InstitutionCard";
import { getInstitutions } from "../../services/UsersService";
import "./institutionPage.css";

export const InstitutionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [usersList, setUsersList] = useState([]);

  const fetchData = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await getInstitutions(search);
      setUsersList(data);
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
    copy[index] = user;
    setUsersList(copy);
  };

  const onUserRemove = (user) => {
    const copy = [...usersList];
    const index = copy.findIndex((x) => x._id === user._id);
    copy.splice(index, 1);
    setUsersList(copy);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ margin: "10px" }}>Manejo de Instituciones</h1>
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
      <div className="up-container">
        {error ? (
          <p style={{ margin: "20px", color: "red" }}>Ocurrió un error</p>
        ) : usersList?.length > 0 ? (
          usersList.map((user, i) => (
            <InstitutionCard
              key={`user-${i}`}
              user={user}
              onUpdate={onUserUpdate}
              onRemove={onUserRemove}
            />
          ))
        ) : (
          <p>
            {search.length > 0
              ? "No se encontraron instituciones cuyo email o nombre contenga la búsqueda"
              : "Aún no hay instituciones."}
          </p>
        )}
      </div>
    </div>
  );
};
