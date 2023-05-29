import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Alert, Snackbar } from "@mui/material";
import { useRef } from 'react';


export default function DishesForm() {
    type Dish = {
        name: string | null,
        preparation_time: string | null,
        type: string | null,
        no_of_slices: number | null,
        diameter: number | null,
        spiciness_scale: number | null,
        slices_of_bread: number | null
    }

    const initailState: Dish = {
        name: null,
        preparation_time: null,
        type: null,
        no_of_slices: null,
        diameter: null,
        spiciness_scale: null,
        slices_of_bread: null
    }
    const inputRefName = useRef<HTMLInputElement>(null);
    const inputRefPreparationTime = useRef<HTMLInputElement>(null);
    const inputRefType = useRef<HTMLInputElement>(null);
    const inputRefNoOfSlices = useRef<HTMLInputElement>(null);
    const inputRefDiameter = useRef<HTMLInputElement>(null);
    const inputRefSpicinessScale = useRef<HTMLInputElement>(null);
    const inputRefSlicesOfBread = useRef<HTMLInputElement>(null);

    const [selectedDish, setSelectedDish] = React.useState("");
    const [form, setForm] = React.useState<Dish>(initailState);
    const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'));
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [response, setResponse] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [errorStaus, setErrorStatus] = React.useState(true);


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    useEffect(() => {

    }, [form, selectedDish, value]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        fetch("https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/", {
            method: "POST",
            body: JSON.stringify(form),
            headers: { "content-type": "application/json" },
        })
            .then((response) => {
                if (response.status === 200) {
                    setErrorStatus(false);
                }
                else {
                    setErrorStatus(true);
                }
                return response.json();
            })
            .then((data) => {
                setResponse(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setErrorStatus(true);
                setResponse(null);
            })
            .finally(() => {
                setLoading(false);
                setOpen(true);
            })
    };

    const handleClearForm = (): void => {
        if (inputRefName.current) {
            inputRefName.current.value = "";
        }
        if (inputRefPreparationTime.current) {
            inputRefPreparationTime.current.value = "";
        }
        if (inputRefType.current) {
            inputRefType.current.value = "";
        }
        if (inputRefNoOfSlices.current) {
            inputRefNoOfSlices.current.value = "";
        }
        if (inputRefDiameter.current) {
            inputRefDiameter.current.value = "";
        }
        if (inputRefSpicinessScale.current) {
            inputRefSpicinessScale.current.value = "";
        }
        if (inputRefSlicesOfBread.current) {
            inputRefSlicesOfBread.current.value = "";
        }
        setForm({ ...initailState })
    }

    const spicinessScale: Array<string> = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const dishType: Array<string> = ["pizza", "soup", "sandwich"];


    const handleClickSelectDish = (value: string) => {
        setSelectedDish(value);
    };

    const onUpdateField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const nextFormState = {
            ...form,
            [name]: value,
        };
        setForm(nextFormState);
    };

    function onUpdateTime(e: Dayjs | null): void {
        const preparation_time: any = e?.format("HH:mm:ss").toString();
        setForm(prevState => ({
            ...prevState,
            preparation_time: preparation_time
        }));
    }

    const checkSelectedDish = (value: string) => {
        if (value === "pizza") {
            return (
                <div>
                    <TextField
                        id="no_of_slices"
                        label="Number of slices"
                        variant="outlined"
                        type="number"
                        name="no_of_slices"
                        inputRef={inputRefNoOfSlices}
                        onChange={onUpdateField}
                        error={form.no_of_slices == null ? true : false}
                        helperText={form.no_of_slices == null ? "Field is required " : ""}
                    />
                    <TextField
                        id="diameter"
                        label="Diameter"
                        variant="outlined"
                        type="number"
                        name="diameter"
                        inputRef={inputRefDiameter}
                        onChange={onUpdateField}
                        error={form.diameter == null ? true : false}
                        helperText={form.diameter == null ? "Field is required " : ""}
                    />

                </div>
            );
        } else if (value === "soup") {
            return (
                <TextField
                    id="spiciness_scale"
                    select
                    label="Spiciness scale"
                    name="spiciness_scale"
                    defaultValue={""}
                    inputRef={inputRefSpicinessScale}
                    onChange={onUpdateField}
                    error={form.spiciness_scale == null ? true : false}
                    helperText={form.spiciness_scale == null ? "Field is required " : ""}
                >
                    {spicinessScale.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else if (value === "sandwich") {
            return (
                <TextField
                    id="slices_of_bread"
                    label="Slices of bread"
                    variant="outlined"
                    type="number"
                    name="slices_of_bread"
                    inputRef={inputRefSlicesOfBread}
                    onChange={onUpdateField}
                    error={form.slices_of_bread == null ? true : false}
                    helperText={form.slices_of_bread == null ? "Field is required " : ""}
                />
            );
        }
    };

    return (
        <Box
            component="form"
            sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <h1>Dish form</h1>
                <TextField
                    id="name"
                    label="Dish name"
                    variant="outlined"
                    name="name"
                    inputRef={inputRefName}
                    onChange={onUpdateField}
                    error={form.name == null ? true : false}
                    helperText={form.name == null ? "Field is required " : ""}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['TimeField']}>
                        <TimeField
                            label="Basic time field"
                            format="HH:mm:ss"
                            name="preparation_time"
                            value={value}
                            inputRef={inputRefPreparationTime}
                            onChange={onUpdateTime}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <TextField
                    id="type"
                    select
                    label="Type of dish"
                    defaultValue=""
                    name="type"
                    inputRef={inputRefType}
                    onChange={onUpdateField}
                    error={form.type == null ? true : false}
                    helperText={form.type == null ? "Field is required " : ""}
                >
                    {dishType.map((option, i) => (
                        <MenuItem
                            key={i}
                            value={option}
                            onClick={() => handleClickSelectDish(option)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                {checkSelectedDish(selectedDish)}
            </div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Button variant="contained" onClick={handleSubmit}>
                    Send form
                </Button>
                <Button variant="outlined" onClick={handleClearForm}>
                    Clear form
                </Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    {errorStaus == false ? <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Send form success!
                    </Alert> : <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Send form error!
                    </Alert>}
                </Snackbar>
            </Stack>
        </Box>
    );
}
