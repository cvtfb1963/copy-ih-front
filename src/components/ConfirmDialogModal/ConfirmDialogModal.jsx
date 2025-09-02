import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  Typography,
} from "@mui/material";

export const ConfirmDialogModal = ({
  message,
  loading,
  onClose,
  onConfirm,
  open,
  color,
  preventPropagation,
}) => {
  return (
    <Modal
      open={open}
      onClose={
        preventPropagation
          ? (e) => {
              e.stopPropagation();
              onClose();
            }
          : onClose
      }
      onClick={
        preventPropagation
          ? (e) => {
              e.stopPropagation();
              onClose();
            }
          : onClose
      }
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>{message}</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <div style={{ width: "100%" }}>
                <Button fullWidth onClick={onClose}>
                  CANCELAR
                </Button>
              </div>
              <div style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    onClose();
                    onConfirm();
                  }}
                  color={color}
                >
                  CONFIRMAR
                </Button>
              </div>
            </>
          )}
        </div>
      </Paper>
    </Modal>
  );
};
