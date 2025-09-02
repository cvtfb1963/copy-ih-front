import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllProfiles } from "../../services/BillingService";
import { ProfileModal } from "../ProfileModal/ProfileModal";

export const ProfileManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data } = await getAllProfiles();
      setProfiles(data);
    } catch (error) {
      console.error(error);
      toast("Error al cargar los perfiles", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setProfileModalOpen(true);
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  const handleProfileSave = (savedProfile) => {
    if (savedProfile.deleted) {
      // Remove deleted profile from list
      setProfiles(profiles.filter((p) => p._id !== savedProfile._id));
    } else if (selectedProfile) {
      // Update existing profile
      setProfiles(
        profiles.map((p) => (p._id === savedProfile._id ? savedProfile : p))
      );
    } else {
      // Add new profile
      setProfiles([...profiles, savedProfile]);
    }
  };

  const handleCloseModal = () => {
    setProfileModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div
      style={{
        margin: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: 0 }}>Gestión de Perfiles</h3>
        <Button variant="contained" onClick={handleCreateProfile}>
          Crear Nuevo Perfil
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
        </div>
      ) : profiles.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Unidades</TableCell>
                <TableCell>Habilidades</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile._id}>
                  <TableCell>{profile._id}</TableCell>
                  <TableCell>
                    <strong>{profile.nombre}</strong>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                    >
                      {profile.units?.length > 0 ? (
                        profile.units.map((unit) => (
                          <Chip
                            key={unit}
                            label={`U${unit}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <span style={{ color: "#666" }}>Sin unidades</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                    >
                      {profile.skills?.length > 0 ? (
                        profile.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <span style={{ color: "#666" }}>Sin habilidades</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditProfile(profile)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>
          No hay perfiles creados. Crea uno para comenzar.
        </p>
      )}

      <ProfileModal
        open={profileModalOpen}
        onClose={handleCloseModal}
        profile={selectedProfile}
        onSave={handleProfileSave}
      />
    </div>
  );
};
