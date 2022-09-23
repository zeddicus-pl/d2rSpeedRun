# SpeedRun Tool for Diablo 2 Resurrected

https://zeddicus-pl.github.io/d2rSpeedRun/

Custom CSS template for OBS browser:
```
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');

/* all text except the "last read" line */
#stats * {
    font-family: "Josefin Sans";
    font-size: 30px;
}

/* labels */
#stats div div div div:first-child {
    width: 100px;
    color: blue;
    /* if you add "!important" in the end it overrides
    /* the colors on the first column, example: */
    /* color: blue; !important; */
}

/* values */
#stats div div div div:nth-child(2) {
    color: red;
}


/* "last read" line */
#stats > div:last-child {
    font-size: 25px !important;
}
```

(the CSP rules are configured to allow importing fonts only from google fonts)
