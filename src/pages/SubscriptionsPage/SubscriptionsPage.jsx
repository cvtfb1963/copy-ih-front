import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConfirmDialogModal } from "../../components/ConfirmDialogModal/ConfirmDialogModal";
import { PlanCard } from "../../components/PlanCard/PlanCard";
import { ProfileManagement } from "../../components/ProfileManagement/ProfileManagement";
import {
  getPublishedSubscriptionPlans,
  getSubscriptionPlans,
  unpublishSubscriptionPlan,
} from "../../services/BillingService";
import { getBillingFrequencyCaption } from "../../utils/utils";
import { CreateSubscriptionPlanModal } from "./CreateSubscriptionPlanModal";
import "./subscriptionsPage.css";

const PAGE_SIZE = 20;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const SubscriptionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingPublishedPlanns, setLoadingPublishedPlans] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [plansList, setPlansList] = useState([]);
  const [publishedPlansList, setPublishedPlansList] = useState([]);
  const [count, setCount] = useState(0);
  const [planSelected, setPlanSelected] = useState(undefined);
  const [planModalOpened, setPlanModalOpened] = useState(false);
  const [createPlanModalOpened, setCreatePlanModalOpened] = useState(false);
  const [unpublishPlanModalOpened, setUnpublishPlanModalOpened] =
    useState(false);
  const [planSelectedToUnpublish, setPlanSelectedToUnpublish] = useState();
  const [tabValue, setTabValue] = useState(0);

  const fetchData = async (e, settedPage) => {
    if (e) e.preventDefault();
    setLoading(true);
    settedPage = settedPage ?? page;
    try {
      const { data } = await getSubscriptionPlans(settedPage);
      setPage(settedPage);
      setPlansList(data.plans);
      setCount(data.total_items);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedPlans = async () => {
    setLoadingPublishedPlans(true);
    try {
      const { data } = await getPublishedSubscriptionPlans();
      setPublishedPlansList(data);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoadingPublishedPlans(false);
    }
  };

  const handleUnpublishPlan = async () => {
    setLoadingPublishedPlans(true);
    try {
      await unpublishSubscriptionPlan(planSelectedToUnpublish);
      setPublishedPlansList((old) => {
        const copy = [...old];
        const index = copy.findIndex(
          (x) => x.id === planSelectedToUnpublish.id
        );
        copy.splice(index, 1);
        return copy;
      });

      //update in the other list
      const copy = [...plansList];
      const index = copy.findIndex((x) => x.id === planSelectedToUnpublish);
      if (index != -1) {
        copy[index] = {
          ...copy[index],
          published: false,
        };
        setPlansList(copy);
      }

      toast("El plan se despublicó correctamente.");
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoadingPublishedPlans(false);
    }
  };

  const onPlanUpdate = (plan) => {
    // If plan was deleted, remove it from the lists
    if (plan.deleted) {
      const copy = plansList.filter((x) => x.id !== plan.id);
      setPlansList(copy);

      const publishedPlansCopy = publishedPlansList.filter(
        (x) => x.id !== plan.id
      );
      setPublishedPlansList(publishedPlansCopy);

      // Close the modal
      setPlanModalOpened(false);
      return;
    }

    const copy = [...plansList];
    const index = copy.findIndex((x) => x.id === plan.id);
    copy[index] = { ...plan };
    setPlansList(copy);

    const publishedPlansCopy = [...publishedPlansList];
    const publishedPlansIndex = publishedPlansCopy.findIndex(
      (x) => x.id === plan.id
    );

    if (publishedPlansIndex != -1) {
      if (plan.published) {
        publishedPlansCopy[publishedPlansIndex] = { ...plan };
      } else {
        publishedPlansCopy.splice(publishedPlansIndex, 1);
      }
      setPublishedPlansList(publishedPlansCopy);
    } else if (plan.published) setPublishedPlansList((old) => [...old, plan]);
  };

  const goToPage = (page) => {
    fetchData(null, page);
  };

  useEffect(() => {
    fetchData();
    fetchPublishedPlans();
  }, []);

  return (
    <div>
      <h1 style={{ margin: "10px" }}>Manejo de Planes de Subscripción</h1>

      <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "20px" }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Planes de Suscripción" />
          <Tab label="Gestión de Perfiles" />  TODO: Add this back when we have profiles
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <div
          style={{
            margin: "20px",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <p className="poppins-semibold">Planes Publicados para Alumnos</p>
          {loadingPublishedPlanns ? (
            <CircularProgress size={"25px"} />
          ) : publishedPlansList?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {publishedPlansList.map((plan) => (
                <div
                  key={`pub-${plan.id}`}
                  style={{
                    border: "0.5px solid gray",
                    margin: "5px",
                    borderRadius: "5px",
                    padding: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <b>{plan.id}</b>:{" "}
                    <span className="poppins-medium">
                      {plan.name ? `${plan.name} - ` : ""}
                      {plan.currency}
                    </span>{" "}
                    ${plan.price}{" "}
                    {getBillingFrequencyCaption(plan.billing_frequency)}
                    {plan.hasFreeTrial && (
                      <span
                        className="poppins-regular"
                        style={{
                          background: "green",
                          color: "white",
                          borderRadius: "10px",
                          border: "1px solid black",
                          padding: "3px",
                          margin: "auto 5px",
                          fontSize: "0.5rem",
                        }}
                      >
                        7 DÍAS DE PRUEBA GRATIS
                      </span>
                    )}
                    {plan.totalCycles && (
                      <span
                        className="poppins-regular"
                        style={{
                          background: "blue",
                          color: "white",
                          borderRadius: "10px",
                          border: "1px solid black",
                          padding: "3px",
                          margin: "auto 5px",
                          fontSize: "0.5rem",
                        }}
                      >
                        {plan.totalCycles} CICLOS
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setPlanSelectedToUnpublish(plan.id);
                      setUnpublishPlanModalOpened(true);
                    }}
                  >
                    Despublicar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Aún no hay planes publicados. Esto significa que los alumnos
              nuevos no podrán suscribirse.
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            sx={{ justifyContent: "end", alignItems: "center" }}
            item
            container
          >
            <Button
              variant="contained"
              onClick={() => setCreatePlanModalOpened(true)}
            >
              Crear Nuevo Plan
            </Button>
          </Grid>
          <Grid
            sx={{ justifyContent: "end", alignItems: "center" }}
            item
            container
          >
            {!loading && !error && (
              <span className="poppins-regular">
                Planes Totales: <span className="poppins-bold">{count}</span>
              </span>
            )}
          </Grid>
          <Grid
            sx={{ justifyContent: "end", alignItems: "center" }}
            item
            container
          >
            {loading ? (
              <div style={{ marginRight: 20 }}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <>
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
              </>
            )}
          </Grid>
        </div>
        {error && (
          <p style={{ margin: "20px", color: "red" }}>Ocurrió un error</p>
        )}
        {plansList?.length > 0 && (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Id</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Free Trial</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Frecuencia</TableCell>
                    <TableCell align="right">Ciclos Totales</TableCell>
                    <TableCell align="right">Perfil</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plansList.map((row, iRow) => (
                    <TableRow
                      key={iRow}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setPlanSelected(row);
                        setPlanModalOpened(true);
                      }}
                    >
                      <TableCell align="center">
                        {row.published && (
                          <WorkspacePremiumIcon
                            style={{ color: "#CFB53B" }}
                            fontSize="large"
                          />
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.name || "-"}</TableCell>
                      <TableCell align="right">
                        {row.hasFreeTrial ? "Si" : "No"}
                      </TableCell>
                      <TableCell align="right">${row.price} USD</TableCell>
                      <TableCell align="right">
                        {getBillingFrequencyCaption(row.billing_frequency)}
                      </TableCell>
                      <TableCell align="right">
                        {row.totalCycles ? row.totalCycles : "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.profile ? (
                          <span style={{ fontSize: "12px" }}>
                            {row.profile.nombre}
                          </span>
                        ) : (
                          <span style={{ color: "#666", fontSize: "12px" }}>
                            Sin perfil
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <Modal
          open={planModalOpened}
          onClose={() => {
            setPlanModalOpened(false);
            setPlanSelected(undefined);
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
              setPlanModalOpened(false);
              setPlanSelected(undefined);
            }}
          >
            <PlanCard plan={planSelected} onUpdate={onPlanUpdate} />
          </div>
        </Modal>
        <CreateSubscriptionPlanModal
          onClose={() => setCreatePlanModalOpened(false)}
          open={createPlanModalOpened}
          onCreate={(plan) => {
            setPlanSelected(plan);
            setPlanModalOpened(true);
            fetchData();
          }}
        />
        <ConfirmDialogModal
          loading={loadingPublishedPlanns}
          message={`¿Desea despublicar este plan? Esto va a prohibir a los alumnos que no estén suscriptos a suscribirse al mismo. Puede volver a publicar el plan cuando desee.`}
          open={unpublishPlanModalOpened}
          onClose={() => setUnpublishPlanModalOpened(false)}
          onConfirm={() => handleUnpublishPlan()}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ProfileManagement />
      </TabPanel>
    </div>
  );
};
