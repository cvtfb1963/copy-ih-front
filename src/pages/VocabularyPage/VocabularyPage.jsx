import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getVocabularyFromJSONs } from "../../services/VocabularyService";
import { unidades } from "../HomePage/HomePage";
import './VocabularyPage.css';

const PAGE_SIZE = 10;
const defaultSearch = {
  unidad: "all",
  vocabularyType: "all",
  vocabularyLevel: "all"
}

// Sparkle component for floating animations
const SparkleEffect = () => (
  <>
    <span className="vocabulary-sparkle">✨</span>
    <span className="vocabulary-sparkle">⭐</span>
    <span className="vocabulary-sparkle">💫</span>
    <span className="vocabulary-sparkle">🌟</span>
  </>
);

export const VocabularyPage = () => {

  const [lastSentData, setLastSentData] = useState({...defaultSearch})
  const [search, setSearch] = useState({...defaultSearch})
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [vocabularyList, setVocabularyList] = useState([]);

  const onChange = ({ target: { value, name } }) =>
    setSearch((old) => ({ ...old, [name]: value }));

  const fetchData = async (selectedPage) => {
    try {
      setLoading(true);
      selectedPage ??= page;
      
      if (String(search.vocabularyLevel) != String(lastSentData.vocabularyLevel) || String(search.unidad) != String(lastSentData.unidad) || String(search.vocabularyType) != String(lastSentData.vocabularyType) ) {
        selectedPage = 1;
      }

      setLastSentData(search)
      const { data } = await getVocabularyFromJSONs(search.unidad, search.vocabularyType, search.vocabularyLevel, selectedPage);
      setPage(selectedPage);
      setVocabularyList(data.data);
      setCount(data.count);
    } catch (e) {
      console.log(e);
      toast("Ocurrió un error, intente nuevamente.", {type: 'error'})
    } finally {
      setLoading(false);
    }
  }

  const goToPage = (page) => {
    fetchData(page)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <div className="vocabulary-page">
    <span className="vocabulary-sparkle">✨</span>
    <span className="vocabulary-sparkle">⭐</span>
    <span className="vocabulary-sparkle">💫</span>
    <span className="vocabulary-sparkle">🌟</span>
    
    <div className="vocabulary-header">
      <h1 className="vocabulary-page-title">Vocabulario</h1>
    </div>

    <div className="vocabulary-filters">
      <div className="vocabulary-filter-item" style={{width: "250px"}}>
        <FormControl fullWidth>
          <InputLabel>Unidad</InputLabel>
          <Select
            value={search?.unidad}
            label="Unidad"
            name="unidad"
            onChange={onChange}
          >
            <MenuItem value={"all"}>Todas</MenuItem>
            {unidades.map((unidad, i) => (
                  <MenuItem key={`s-u-${i + 1}`} value={i + 1}>
                    <b>Unidad {i + 1}</b>: {unidad.title}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </div>
      <div className="vocabulary-filter-item" style={{width: "190px"}}>
        <FormControl fullWidth>
          <InputLabel>Tipo de vocabulario</InputLabel>
          <Select
            value={search?.vocabularyType}
            label="Tipo de vocabulario"
            name="vocabularyType"
            onChange={onChange}
          >
            <MenuItem value={"all"}>Todos</MenuItem>
            <MenuItem value={"base"}>
              Base 
            </MenuItem>
            <MenuItem value={"collocation"}>
              Collocation 
            </MenuItem>
            <MenuItem value={"phrasal"}>
              Phrasal 
            </MenuItem>
            <MenuItem value={"idiom"}>
              Idiom 
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="vocabulary-filter-item" style={{width: "190px"}}>
        <FormControl fullWidth>
          <InputLabel>Nivel de vocabulario</InputLabel>
          <Select
            value={search?.vocabularyLevel}
            label="Nivel de vocabulario"
            name="vocabularyLevel"
            onChange={onChange}
          >
            <MenuItem value={"all"}>Todos</MenuItem>
            <MenuItem value={"A1"}>A1</MenuItem>
            <MenuItem value={"A2"}>A2</MenuItem>
            <MenuItem value={"B1"}>B1</MenuItem>
            <MenuItem value={"B2"}>B2</MenuItem>
            <MenuItem value={"C1"}>C1</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button 
        variant="contained" 
        disabled={loading} 
        onClick={() => fetchData()}
        className="vocabulary-search-btn"
      >
        BUSCAR
      </Button>
      <Grid
          sx={{ justifyContent: "end", alignItems: "center" }}
          item
          container
          className="vocabulary-pagination"
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

    <div className="vocabulary-content">
      {loading ? (
        <div className="vocabulary-loading">
          <CircularProgress size={60} style={{color: '#58cc02'}} />
        </div>
      ) : vocabularyList.length == 0 ? (
        <div className="vocabulary-empty">
          No se encontró vocabulario con los filtros especificados.
        </div>
      ) : (
        <div className="vocabulary-list">
          {vocabularyList.map((data, key) => 
            <div key={key} className="vocabulary-card">
              <Accordion className="vocabulary-accordion">
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon className="vocabulary-expand-icon" />}
                  className="vocabulary-accordion-summary"
                >
                  <p className="vocabulary-word-title">{data.title}</p>
                </AccordionSummary>
                <AccordionDetails className="vocabulary-accordion-details">
                  <div className="vocabulary-content-wrapper">
                    <p className="vocabulary-explanation">{data.explanation}</p>
                    <p className="vocabulary-example-label">Veamos un ejemplo:</p>
                    <p className="vocabulary-example">{data.example}</p>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
};
