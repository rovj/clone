import React, { useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const contextObj = useContext(AuthContext);
  let navigate = useNavigate();
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.fullname.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleSearch = (user) => {
    contextObj.setVisitedUser(user);
    navigate("/visit/" + user.docId);
  };

  return (
    <Grid
      container
      className="search"
      sx={{ backgroundColor: "background.paper" }}
    >
      <Grid item className="searchInputs">
        <TextField
          label={placeholder}
          variant="filled"
          value={wordEntered}
          onChange={handleFilter}
          size="small"
          width="25vw"
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </Grid>
      {filteredData.length != 0 && (
        <Grid item className="dataResult">
          {filteredData.map((value, key) => {
            let nameArr = value.fullname.split(" ");
            let tempUserName = "";
            nameArr.forEach((name) => {
              tempUserName = tempUserName + name.toLowerCase() + "_";
            });
            tempUserName = tempUserName + value.email.length;
            return (
              <Grid item onClick={() => handleSearch(value)}>
                <p>{value.fullname} </p>
                <p>{tempUserName}</p>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
}

export default SearchBar;
