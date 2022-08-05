import React from 'react'
import './homePage(PC).css'
import './homePage(tablet).css'
import './homePage(mobile).css'
import Cards from '../cards/Cards'
import axios from 'axios'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import InfoIcon from '@mui/icons-material/Info';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

import { useEffect, useState } from 'react'
export default function HomePage() {

    //"api_Data" contains all the data whereas "data_to_display" would contain,data to be shown before after filters.
    const [api_Data, setapi_Data] = useState([])
    const [data_to_display, setdata_to_display] = useState([])
    const [filterType, setfilterType] = useState('country')

    //"countryData" and "vehicleData" would contain data to be shown in filter
    const [countryData, setcountryData] = useState([]);
    const [vehicleData, setvehicleData] = useState([]);

    //"countryFilterArray" and "vehicleFilterArray" would contain all the selected filter values.
    const [countryFilterArray, setcountryFilterArray] = useState([])
    const [vehicleFilterArray, setvehicleFilterArray] = useState([])

    //"searchData" would contain the value of searchBar
    const [searchData, setsearchData] = useState('')

    //"alphabetic order":: weather to show filter options in alphabetic order or random order
    const [alphabeticOrder, setalphabeticOrder] = useState(false)


    const getdata = async () => {
        await axios.get('https://612619c7e40e1900170727fe.mockapi.io/api/users').then((res) => {
            setapi_Data(res.data);
            setdata_to_display(res.data);
            setcountryData(res.data);
            setvehicleData(res.data);

        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        getdata();
        changeColorToBlue();
    }, [])


    // changeColorToBlue() / changeColorToWhite():: To give style to our country filter button.
    const changeColorToBlue = () => {
        document.getElementById("country_filter").style.backgroundColor = '#24a0ed';
        document.getElementById("country_filter").style.color = 'white';
    }
    const changeColorToWhite = () => {
        document.getElementById("country_filter").style.backgroundColor = 'white';
        document.getElementById("country_filter").style.color = 'black';
    }



    // check_country_button():: Whenever checkbox is checked it will add that value to countryFilterArray and remove whenever unchecked.
    const check_country_button = (value) => {
        let checkbox = document.getElementById(`${value}`);
        if (checkbox.checked)
            setcountryFilterArray([...countryFilterArray, value]);
        else {
            for (var i = 0; i < countryFilterArray.length; i++) {
                if (countryFilterArray[i] === value) {
                    countryFilterArray.splice(i, 1);
                    break;
                }
            }
        }
    }


    // check_vehicle_button():: Whenever checkbox is checked it will add that value to vehicleFilterArray and remove whenever unchecked.
    const check_vehicle_button = (value) => {
        let checkbox = document.getElementById(`${value}`);
        if (checkbox.checked)
            setvehicleFilterArray([...vehicleFilterArray, value]);
        else {
            for (var i = 0; i < vehicleFilterArray.length; i++) {
                if (vehicleFilterArray[i] === value) {
                    vehicleFilterArray.splice(i, 1);
                    break;
                }
            }
        }
    }

    // handle_apply_filter():: To handle apply filters 
    const handle_apply_filter = () => {

        let Temp_arr = [];

        if (countryFilterArray.length > 0 || vehicleFilterArray.length > 0) {

            for (var i = 0; i < api_Data.length; i++) {
                // Here we are handling case that user only used country filter or both.
                if (countryFilterArray.length > 0) {
                    for (var j = 0; j < countryFilterArray.length; j++) {
                        if (api_Data[i].country === countryFilterArray[j]) {
                            if (vehicleFilterArray.length > 0) {
                                for (var k = 0; k < vehicleFilterArray.length; k++) {
                                    if (api_Data[i].vehicle === vehicleFilterArray[k]) {
                                        Temp_arr.push(api_Data[i]);
                                        continue;
                                    }
                                }
                            }

                            else {
                                Temp_arr.push(api_Data[i]);
                                continue;
                            }
                        }
                    }
                    setdata_to_display(Temp_arr);
                }


                // Here we are handling case where user only used vehicle filter or both.
                else if (vehicleFilterArray.length > 0) {
                    for (var m = 0; m < vehicleFilterArray.length; m++) {
                        if (api_Data[i].vehicle === vehicleFilterArray[m]) {
                            if (countryFilterArray.length > 0) {
                                for (var n = 0; n < countryFilterArray.length; n++) {
                                    if (api_Data[i].country === countryFilterArray[n]) {
                                        Temp_arr.push(api_Data[i]);
                                        continue;
                                    }
                                }
                            }

                            else {
                                Temp_arr.push(api_Data[i]);
                                continue;
                            }
                        }
                    }
                    setdata_to_display(Temp_arr);
                }
            }

        }
    }

    const removeDuplicateValues=()=>{
        const countryArray = [...api_Data];
        const vehicleArray = [...api_Data];
        setdata_to_display(api_Data);
        const filteredCountryArray =countryArray.reduce((acc, current) => {
            const x = acc.find(item => item.country === current.country);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        const filteredVehicleArray=vehicleArray.reduce((acc, current) => {
            const x = acc.find(item => item.vehicle === current.vehicle);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        setcountryData(filteredCountryArray);
        setvehicleData(filteredVehicleArray);

    }
    // handle_remove_filter():: To handle remove filters
    const handle_remove_filter = () => {
        removeDuplicateValues();
        
        let element = document.getElementsByClassName('form-check-input');

        for (var i = 0; i < api_Data.length; i++) {
            element[i].checked = false;
        }
        setcountryFilterArray([]);
        setvehicleFilterArray([]);
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            let Temp_arr = [];
            api_Data.map((val) => {
                if (val.country.toUpperCase() === searchData.toUpperCase() || val.vehicle.toUpperCase() === searchData.toUpperCase() || val.name.toUpperCase() === searchData.toUpperCase())
                    Temp_arr.push(val);
            })
            setdata_to_display(Temp_arr);
        }

    }

    function compare1(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.vehicle.toUpperCase();
        const bandB = b.vehicle.toUpperCase();

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function compare2(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.country.toUpperCase();
        const bandB = b.country.toUpperCase();

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }



    // To show filter options in alphabetic order
    const show_filter_data_alphabetic_order = () => {
        const countryArray = [...api_Data];
        const vehicleArray = [...api_Data];
        countryArray.sort(compare2);
        vehicleArray.sort(compare1);


        const filteredCountryArray =countryArray.reduce((acc, current) => {
            const x = acc.find(item => item.country === current.country);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        const filteredVehicleArray=vehicleArray.reduce((acc, current) => {
            const x = acc.find(item => item.vehicle === current.vehicle);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

       


        setcountryData(filteredCountryArray);
        setvehicleData(filteredVehicleArray);

        setalphabeticOrder(true)
    }

    // To show filter options in random order
    const show_filter_data_random_order = () => {
        removeDuplicateValues();
        setalphabeticOrder(false)
    }




    return (
        <div className="filter_Container">
            <div className="filter_Conatiner_header">
                <div className="filter_Container_header_title">TRY OUR FILTERS</div>
            </div>

            <div className="filter_container_main">


                <div className="apply_Filter">
                    <p>Filter:</p>
                </div>

                <div className="dropdown_container modal_body_container">
                    <button type="button" className="btn btn-info dropdownButton" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
                        Filters
                    </button>

                    <button type="button" className="btn btn-warning show_all_data_button" onClick={() => { handle_remove_filter() }}>Remove All Filters</button>


                    <div className="modal fade " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal_main_container">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button className="btn modal_filter_button " onClick={() => { setfilterType('country'); changeColorToBlue() }} id="country_filter">countries</button>
                                    <button className="btn modal_filter_button  mx-3" onClick={() => { setfilterType('vehicle'); changeColorToWhite() }}>vehicles</button>
                                    <Tippy content="Alphabetic Order">
                                        <button style={{ backgroundColor: 'white', border: 'none' }} onClick={() => { (alphabeticOrder == false) ? show_filter_data_alphabetic_order() : show_filter_data_random_order() }}><SortByAlphaIcon style={(alphabeticOrder == true) ? { color: '#24a0ed', fontWeight: '700' } : { color: 'black', fontWeight: '700' }} /></button>
                                    </Tippy>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setfilterType('country'); changeColorToBlue() }}></button>
                                </div>
                                <div className="modal-body modal_filter_body">

                                    {(filterType === 'country') ? countryData.map((val) => {
                                        return (<div className="filter_options" key={val.id}> <input className="form-check-input mt-0" type="checkbox" id={val.country} aria-label="Checkbox for following text input" onClick={() => { check_country_button(val.country) }} /><p className="mx-1">{val.country}</p></div>)
                                    }) : vehicleData.map((val) => {
                                        return (<div className="filter_options" key={val.id + api_Data.length}><input className="form-check-input mt-0" type="checkbox" id={val.vehicle} aria-label="Checkbox for following text input" onClick={() => { check_vehicle_button(val.vehicle) }} /><p className="mx-1">{val.vehicle}</p></div>)
                                    })}

                                </div>
                                <div className="modal-footer">
                                    <button type="button" data-bs-dismiss="modal" className="btn btn-success" onClick={() => { handle_apply_filter(); changeColorToBlue() }}>Apply Filters</button>
                                    <button type="button" data-bs-dismiss="modal" className="btn btn-danger" onClick={() => { handle_remove_filter(); changeColorToBlue() }}>Remove Filters</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="searchBar_container" style={{ display: 'flex' }}>
                    <input className="form-control me-2 searchBar_input" type="search" placeholder="Search" aria-label="Search" onChange={(e) => { setsearchData(e.target.value) }} onKeyDown={handleKeyDown} />
                    <Tippy content="Search for country / vehicle / name">
                        <button style={{ backgroundColor: 'white', border: 'none', marginLeft: '-5px' }}><InfoIcon /></button>
                    </Tippy>
                </div>


                <div className="show_Content">
                    <p style={{ color: 'red', marginTop: '5px', fontWeight: '600', fontSize: '15px' }}>*Scroll right-left on the data to get full names.</p>
                    {(data_to_display.length === 0) ? <p>No Data To Show!!</p> : data_to_display.map((val) => {
                        return <Cards key={val.createdAt} name={val.name} country={val.country} email={val.email} vehicle={val.vehicle} avatar={val.avatar} />

                    })}

                </div>
            </div>
        </div>
    )
}
