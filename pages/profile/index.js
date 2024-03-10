import React from 'react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSquarePlus, faSquareMinus, faEdit, faTrashAlt, faImage } from '@fortawesome/free-regular-svg-icons';
library.add(faSquarePlus, faSquareMinus, faEdit, faTrashAlt, faImage);
import { faTimes } from "@fortawesome/free-solid-svg-icons";
library.add(faTimes);

import style from './profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch , useSelector } from 'react-redux';
import Swal from "sweetalert2";
import withAuth from '../../components/withAuth/withAuth';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getNavbarColor } from '../../store/actions';
import editImage from '../../public/assets/image/editImage.png';
import zoom from '../../public/assets/image/zoom.png';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Approved from '../../public/assets/image/approved.png';
import Reject from '../../public/assets/image/REJECT.png';
import Order from '../../components/order/order';

import Shipping from '../../components/shipping/shipping';

import closeImage from '../../public/assets/image/exit-icon.webp';

import addImage from '../../public/assets/image/add.png';

const Profile = () => {


    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);
  
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
    };


    const dispatch = useDispatch();

    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");

    const [showImge, setShowImge] = useState(false);

    const handleImageClose = () => setShowImge(false);
    const handleImageShow = (caption, image) => {
        setCaption(caption);
        setImage(image);
        setShowImge(true);
    }

    const [showFinancial, setShowFinancial] = useState(false);

    const handleFinancialClose = () => setShowFinancial(false);
    const handleFinancialShow = () => setShowFinancial(true);


    const [showEditBank, setShowEditBank] = useState(false);

    const handleEditBankClose = () => setShowEditBank(false);
    const handleEditBankShow = () => setShowEditBank(true);


    const [showAddBank, setShowAddBank] = useState(false);

    const handleAddBankClose = () => setShowAddBank(false);
    const handleAddBankShow = () => setShowAddBank(true);


    let token = localStorage.getItem('token');

    const [userImg, setUserImg] = useState('');

    const [userInfo, setUserInfo] = useState({});

    const [bank, setBank] = useState([]);

    const [approvalImgs, setApprovalImgs] = useState([]);

    const [data, setData] = useState({
        full_name: "",
        national_id: "",
        address: "",
        phone: "",
        birthday: "",
        countryId: "",
        countryName: ""
    });

    const [financialData, setFinancialData] = useState({
        commercial_reg: "",
        tax_number: "",
        notes: ""
    });

    const [errors, setError] = useState({
        full_name: "",
        national_id: "",
        address: "",
        phone: "",
        birthday: "",
        country: "",
    });


    const handleInfo = async () => {
        await axiosInstance.post('user/user_profile', {
            token: token
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {

            setData({
                full_name: res.data.user_data.full_name,
                national_id: res.data.user_data.national_id,
                address: res.data.user_data.address,
                phone: res.data.user_data.phone,
                birthday: res.data.user_data.birthday,
                countryId: res.data.user_data.country[0],
                countryName: res.data.user_data.country[1]
            });

            setFinancialData({
                commercial_reg: res.data.user_data.commercial_reg,
                tax_number: res.data.user_data.tax_number,
                notes: res.data.user_data.notes
            });

            let user = JSON.parse(localStorage.getItem("user_info"));

            user.user_img = res.data.user_data.img;

            setApprovalImgs(res.data.user_data.approval_imgs)

            localStorage.setItem("user_info", JSON.stringify(user));

            const imageUrl = URL.createObjectURL(
                new Blob([base64ToArrayBuffer(res.data.user_data.img)], { type: 'image/jpeg' })
            );

            setUserImg(imageUrl);
            setUserInfo(res.data.user_data);

            setCustumerId(res.data.user_data.customer_id);
            setDefaultShipping(res.data.user_data.default_shipping);

     
            viewAllBanks(res.data.user_data.customer_id);
            viewAllApprovalImgs(res.data.user_data.customer_id);
        }).catch((err) => {
            console.log("err", err)
        });


    }

    const [custumerId, setCustumerId] = useState(0);
    const [defaultShipping, setDefaultShipping] = useState(0);

    const viewAllBanks = async (customer_id) => {
        await axiosInstance.post('user/view_all_banks', {
            token: token,
            customer_id: customer_id,
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            setBank(res.data.success);
        }).catch((err) => {
            console.log("err", err)
        });
    }


    const viewAllApprovalImgs = async (customer_id) => {
        await axiosInstance.post('user/view_all_approval_imgs', {
            token: token,
            customer_id: customer_id,
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            setApprovalImgs(res.data.success);
        })
            .catch((err) => {
                console.log("err", err)
            });
    }

    const base64ToArrayBuffer = base64 => {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };


    const handleFileInputChange = async (e) => {

        setUserImg(e.target.files[0]);

        const formData = new FormData();

        formData.append('user_img', e.target.files[0]);
        formData.append('token', token);

        await axiosInstance.post(`user/update_profile_img`, formData
            , {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }).then(res => {
                console.log(res);
                handleInfo();
                showAlert(listRef.current[res.data.success], "success");
            }).catch(err => {
                console.log(err);
                // showAlert(res.data.error, "error");
            });

    };

    function showAlert(message, icon) {
        Swal.fire({
            title: message,
            icon: icon,
            showConfirmButton: false,
            timer: 1500
        });
    }



    function editProfile(e) {
        e.preventDefault();
        axiosInstance.post(`user/edit_user_profile`, {
            full_name: data.full_name,
            national_id: data.national_id,
            address: data.address,
            phone: data.phone,
            birthday: data.birthday,
            country: data.countryId,
            token: token
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            handleInfo();
            if (res.data.success) {
                showAlert(listRef.current[res.data.success], "success");
            } else {
                showAlert(listRef.current[res.data.error], "error");
            }
        }).catch((err) => {
            console.log("error: ", err);
        });
        return false
    }



    const [countries, setCountries] = useState([])

    const getCountry = async () => {
        await axiosInstance.post('user/countries', {
            token: token
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            setCountries(res.data.countries);
        }).catch((err) => {
            console.log("err", err)
        });
    }


    function handleInputChange(event) {
        const { id, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }



    // financial information
    function editFinancial(e) {
        let notes = 'notes';
        if (financialData.notes != null) {
            notes = financialData.notes;
        }
        e.preventDefault();
        axiosInstance.post(`user/update_approval_info`, {
            commercial_reg: financialData.commercial_reg,
            tax_number: financialData.tax_number,
            notes: notes,
            customer_id: userInfo.customer_id,
            token: token
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then((res) => {

            handleInfo();
            handleFinancialClose();

            if (res.data.success) {
                showAlert(listRef.current[res.data.success], "success");
            } else {
                showAlert(listRef.current[res.data.error], "error");
            }
        }).catch((err) => {
            console.log("error: ", err);
        });
        return false
    }


    function handleFinancialChange(event) {
        const { id, value } = event.target;
        setFinancialData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }

    useEffect(() => {
        dispatch(getNavbarColor("#0B2802"));
        handleInfo();
        getCountry();
    }, []);



    // bank

    const [bankForEdit, setBankForEdit] = useState({});

    const viewOneBank = async (id) => {
        await axiosInstance.post('user/view_one_bank', {
            token: token,
            id: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {

            if (res.data.success) {
                setBankForEdit(res.data.success);
            }

        }).catch((err) => {
            console.log("err", err)
        });
    }


    const EditBank = async (e) => {
        e.preventDefault();
        await axiosInstance.post('user/update_bank_info', {
            token: token,
            customer_id: userInfo.customer_id,
            id: bankForEdit.id,
            bank_name: bankForEdit.bank_name,
            bank_account: bankForEdit.bank_account
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.data.success) {
                showAlert(listRef.current[res.data.success], "success");
                viewAllBanks(userInfo.customer_id);
                let bankEdit = document.getElementById('bankEdit');
                if (bankEdit.classList.contains("d-none") == false) {
                    bankEdit.classList.add("d-none");
                }
            } else {
                showAlert(listRef.current[res.data.error], "error");
            }

        }).catch((err) => {
            console.log("err", err)
        });
    }

    function handleBankChange(event) {
        const { id, value } = event.target;
        setBankForEdit((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }


    // const [newAddress, setNewAddress] = useState("");

    const AddBank = async (e) => {
        e.preventDefault();
        await axiosInstance.post('user/add_bank_account', {
            token: token,
            customer_id: userInfo.customer_id,
            bank_name: bankForEdit.bank_name,
            bank_account: bankForEdit.bank_account
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.data.success) {
                showAlert(listRef.current[res.data.success], "success");
                e.target.reset();
                let bankInput = document.getElementById('bankInput');
                if (bankInput.classList.contains("d-none") == false) {
                    bankInput.classList.add("d-none");
                }
                viewAllBanks(userInfo.customer_id);
            } else {
                showAlert(listRef.current[res.data.error], "error");
            }

        }).catch((err) => {
            console.log("err", err)
        });
    }




    function DeleteAlert(type, id) {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {    
                DeleteBank(id);

            }
        })
    }




    const DeleteBank = async (id) => {
        await axiosInstance.post('user/delete_bank_info', {
            id: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.data.success) {
                showAlert(listRef.current[res.data.success], "success");
                viewAllBanks(userInfo.customer_id);
            } else {
                showAlert(listRef.current[res.data.error], "error");
            }

        }).catch((err) => {
            console.log("err", err)
        });
    }



    // upload Image

    const [selectedFile, setSelectedFile] = useState("");

    const [errorMessage, setErrorMessage] = useState('');
    const [invalid, setInvalid] = useState(false);

    const filesSelected = (e) => {

        setSelectedFile(e.target.files[0]);

        if (validateSelectedFile(e.target.files[0]) == false) {
            setInvalid(true)
            setErrorMessage("File size is greater than maximum limit 2M");
        } else {
            setInvalid(false)
            setErrorMessage("");
        }

    }


    const [progress, setProgress] = useState(0);

    const uploadFiles = async (e) => {
        e.preventDefault();

        if (invalid == false && selectedFile != "") {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('image_caption', caption);
            formData.append('customer_id', userInfo.customer_id);
            formData.append('token', token);
            let prog = document.getElementById("progress");

            let approvalImg = document.getElementById('approvalImg');



            await axiosInstance.post('user/add_one_approval_imgs', formData, {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                }
            }).then(res => {
                console.log("res", res);
                if (res.data.error) {
                    showAlert(listRef.current[res.data.error], "error");
                } else {
                    showAlert(listRef.current[res.data.success], "success");
                    viewAllApprovalImgs(userInfo.customer_id);
                    prog.classList.add("d-none");

                    approvalImg.classList.add("d-none");
                }
            }).catch((err) => {
                console.log("err", err);
            });
        } else {
            showAlert(listRef.current[res.data.error], "error");
        }
    };

    const validateSelectedFile = (selectedFile) => {

        // const MAX_FILE_SIZE = 2048 // 2MB

        const MAX_FILE_SIZE = 204800000000

        const fileSizeKiloBytes = selectedFile.size / 1024

        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            return false;
        } else {
            return true;
        }
    };

    useEffect(() => {
        let prog = document.getElementById("progress");
        if (progress == 1) {
            prog.classList.remove("d-none");
        }
    }, [progress]);

    return (
        <section className={`${style.profile}  page-section`} style={{ backgroundColor: '#eee' }}>
            <div className='container py-5'>
                <div className='row'>

                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col className={`${style.profileOption}  profileOption mb-3`} sm={3}>
                                <h3>{listRef.current.VAR000066_my_profile_AITSP0000}</h3>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">{listRef.current.VAR000095_edit_profile_AITSP00}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">{listRef.current.VAR000067_approval_decoments_A}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">{listRef.current.VAR000068_financial_informatio}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fourth">{listRef.current.VAR000069_shipping_adresses_AI}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fifth">{listRef.current.VAR000070_order_AITSP000000000}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="sixth">{listRef.current.VAR000071_payments_AITSP000000}</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <div className={`${style.editProfile}`}>
                                            <div id="profile-img">
                                                <label for="file" className="position-relative">
                                                    <img src={userImg}
                                                        alt="avatar"
                                                        className="rounded-circle my-2"
                                                        style={{ width: '100px', height: "100px", marginTop: '10px' }}
                                                        fluid />

                                                    <Image style={{ width: '30px', height: "30px" }} type="button" className={`${style.editImage}`} src={editImage} alt="image one" />
                                                </label>
                                                <input id="file" onChange={(e) => {
                                                    handleFileInputChange(e);
                                                }}
                                                    className='my-2 d-none' name="emp_photo_filename_path" type="file" accept="image/*" />
                                            </div>
                                            <div className={`${style.nameEmail}`}>
                                                <div>
                                                    <h6>{userInfo ? userInfo.full_name : ''}</h6>
                                                    <p>{userInfo ? userInfo.email : ''}</p>
                                                </div>

                                            </div>

                                        </div>
                                        <div className={`${style.editProfile2} mt-3 pb-5`}>
                                            <div>
                                                <h3>{listRef.current.VAR000073_personal_information}</h3>

                                                <form id="form" onSubmit={editProfile} className="reg row ">

                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className="my-2">{listRef.current.VAR000074_full_name_AITSP00000}</label>
                                                        <input id="full_name" type="text" className={`form-control  input`}
                                                            autoComplete="name" value={data.full_name} onChange={handleInputChange}
                                                            placeholder={listRef.current.VAR000074_full_name_AITSP00000} />

                                                    </div>

                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className=" my-2">{listRef.current.VAR000077_national_id_AITSP000}</label>
                                                        <input id="national_id" type="text" className={`form-control  input `}
                                                            autoComplete="national_id" value={data.national_id} onChange={handleInputChange}
                                                            placeholder={listRef.current.VAR000077_national_id_AITSP000} />

                                                    </div>


                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className=" my-2">{listRef.current.VAR000075_address_AITSP0000000}</label>
                                                        <input id="address" type="text"
                                                            className="form-control input"
                                                            autoComplete="address" value={data.address} onChange={handleInputChange}
                                                            placeholder={listRef.current.VAR000075_address_AITSP0000000} />

                                                    </div>


                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className=" my-2">{listRef.current.VAR000078_phone_AITSP000000000}</label>
                                                        <input type="tel" id="phone" value={data.phone} onChange={handleInputChange}
                                                            className={`form-control mb-3 input`} required
                                                            placeholder={listRef.current.VAR000078_phone_AITSP000000000} />

                                                    </div>

                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className=" my-2">{listRef.current.VAR000076_birthday_AITSP000000}</label>
                                                        <input type="date" id="birthday" value={data.birthday} onChange={handleInputChange}
                                                            className={`form-control mb-3 input `} required
                                                            placeholder={listRef.current.VAR000076_birthday_AITSP000000} />

                                                    </div>

                                                    <div className='inp d-inline-block px-2 col-lg-6 '>
                                                        <label className=" my-2">{listRef.current.VAR000079_country_AITSP0000000}</label>
                                                        <select className={`form-control mb-3 `}
                                                            id="country" onChange={(e) => {
                                                                data.countryId = e.target.value;
                                                                setData(data);
                                                            }} >
                                                            {(userInfo.country == "0") ? (
                                                                <option value={listRef.current.VAR000079_country_AITSP0000000} selected disabled>{listRef.current.VAR000079_country_AITSP0000000}</option>
                                                            ) : (
                                                                <option value={data.countryId} selected disabled>{data.countryName}</option>
                                                            )}

                                                            {countries.map((country, index) => {
                                                                return (
                                                                    <option key={index} value={country[0]}>{country[1]}</option>
                                                                )
                                                            })
                                                            }

                                                        </select>


                                                    </div>

                                                    <div className='d-flex justify-content-center'>
                                                        <button type='submit' className={`${style.btnEdit}`}>
                                                        {listRef.current.VAR000080_edit_AITSP0000000000}
                                                        </button>
                                                    </div>



                                                </form>


                                            </div>

                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">

                                        <div className={`${style.approval} approval`}>
                                            <h3 className='mx-2'>{listRef.current.VAR000067_approval_decoments_A}</h3>

                                            <div className={`${style.aboutThree} aboutThree `}>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={`${style.item} my-4`}>
                                                        <Slider {...settings}>
                                                            {
                                                                approvalImgs.length != 0 ? (


                                                                    approvalImgs.map((img, index) => {
                                                                        return (
                                                                            <div className={`${style.item} `} key={index}>
                                                                                <div className="position-relative">
                                                                                    <img src={`data:image/png;base64, ${img.image}`}
                                                                                        alt="avatar"
                                                                                        className={` rounded-2 my-2 w-100`}
                                                                                        style={{ height: "160px" }}
                                                                                        fluid />
                                                                                    <div className={`${style.AproovalImg} rounded-2 w-100 d-flex justify-content-center align-items-center`}>
                                                                                        {(img.status == 'approved') ?
                                                                                            (
                                                                                                <Image src={Approved} alt="image Approved" />
                                                                                            ) : ((img.status == 'refused') ? (
                                                                                                <Image src={Reject} alt="image Reject" />
                                                                                            ) : (
                                                                                                <></>
                                                                                            )


                                                                                            )

                                                                                        }
                                                                                    </div>
                                                                                    <Image type="button" src={zoom} alt="image one" onClick={() => {
                                                                                        handleImageShow(img.caption, img.image);
                                                                                    }} className='position-absolute bottom-0 end-0 m-3' />
                                                                                </div>
                                                                                <p className="text-center">{img.caption}</p>
                                                                            </div>
                                                                        )
                                                                    })

                                                                ) : (
                                                                    <p className={`${style.noDecoment}`}>{listRef.current.VAR000096_no_decoment_informat}</p>
                                                                )
                                                            }


                                                        </Slider>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className={`${style.approval} mt-3 d-flex justify-content-center`} id="approvalImg" >
                                            <div className={`${style.item}`}>
                                                <form onSubmit={uploadFiles}>
                                                    <div className={`d-flex `}>

                                                        <label for="fileInp" className=" position-relative">
                                                            <div className={`${style.inputFileAlt}`}>{listRef.current.VAR000081_choose_file_AITSP000}</div>
                                                        </label>
                                                        <input onChange={filesSelected} id='fileInp' className='d-none' name="file" type="file" />

                                                        <input className={`${style.inputFileInp}`} type="text" placeholder={listRef.current.VAR000136_add_caption_to_image} onChange={(e) => {
                                                            setCaption(e.target.value)
                                                        }} />
                                                    </div>
                                                    <p className="text-danger">{errorMessage}</p>

                                                    <div id="progress" className='d-none my-3'>
                                                        <ProgressBar animated now={progress} />
                                                    </div>

                                                    <div className='d-flex justify-content-center'>
                                                        <button type='submit' className={`${style.btnEdit}`}>
                                                        {listRef.current.VAR000082_upload_AITSP00000000}
                                                        </button>
                                                    </div>


                                                </form>
                                            </div>

                                        </div>

                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">

                                        <div className={`${style.financialInformation} p-4 mb-4`} >
                                            <div className='d-flex  justify-content-between'>
                                                <h5>{listRef.current.VAR000068_financial_informatio}</h5>
                                                <FontAwesomeIcon type='button' icon={faEdit} className={`${style.iconE}  fs-3 ms-2`} onClick={handleFinancialShow} />
                                            </div>

                                            {(userInfo.commercial_reg != null) ? (
                                                <h6>{listRef.current.VAR000083_commercial_reg_AITSP}: <span>{userInfo ? userInfo.commercial_reg : ''}</span> </h6>
                                            ) : (
                                                <h6>{listRef.current.VAR000083_commercial_reg_AITSP}: <span className='text-danger'>{listRef.current.VAR000097_you_have_to_put_your}</span></h6>
                                            )}

                                            {(userInfo.tax_number != null) ? (
                                                <h6>{listRef.current.VAR000084_tax_number_AITSP0000}: <span>{userInfo ? userInfo.tax_number : ''}</span> </h6>
                                            ) : (
                                                <h6>{listRef.current.VAR000084_tax_number_AITSP0000}: <span className='text-danger'>{listRef.current.VAR000098_you_have_to_put_your}</span></h6>
                                            )}

                                            {(userInfo.notes != null) ? (
                                                <h6>{listRef.current.VAR000085_notes_AITSP000000000}: <span>{userInfo ? userInfo.notes : ''}</span> </h6>
                                            ) : (
                                                <h6>{listRef.current.VAR000085_notes_AITSP000000000}: <span className='text-muted'>{listRef.current.VAR000099_put_your_notes_if_yo}</span></h6>
                                            )}

                                        </div>

                                        <div className={`${style.financialInformation} p-4`} >
                                            <h5>{listRef.current.VAR000086_bank_information_AIT}</h5>

                                            {(bank.length == 0) ? (
                                                <p>{listRef.current.VAR000100_no_bank_information_}</p>
                                            ) : (
                                                <>

                                                    {bank.map((ele, index) => {
                                                        return (
                                                            <div key={index} className='mb-2'>
                                                                <div className={`${style.bankt} `}>
                                                                    <p>{listRef.current.VAR000102_bank_AITSP0000000000}: {ele[1]}</p>
                                                                    <span className='mx-2'> | </span>
                                                                    <p>{listRef.current.VAR000101_account_AITSP0000000}: {ele[2]}</p>

                                                                    <FontAwesomeIcon icon={faEdit} className={`${style.iconE}  fs-5 ms-2`} onClick={() => {
                                                                        let id = ele[0];
                                                                        viewOneBank(id);
                                                                        handleEditBankShow();
                                                                    }} />

                                                                    <FontAwesomeIcon icon={faTrashAlt} className='text-danger fs-5 ms-2' onClick={() => {
                                                                        let id = ele[0];
                                                                        DeleteAlert('bank', id);
                                                                    }} />


                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                    <button type='submit' className={`${style.btnSend} d-flex`} onClick={handleAddBankShow} >
                                                        <Image src={addImage} alt="close Image" style={{ width: "30px", height: "30px" }} />
                                                        <span className='fw-bold mx-2 mt-1'>{listRef.current.VAR000087_add_AITSP00000000000}</span>
                                                    </button>

                                                </>
                                            )}
                                        </div>


                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fourth">
                                        <div className={`${style.shippingAdr}  ${style.fixed}`}>
                                            <Shipping custumerId={custumerId} defaultShipping={defaultShipping} handleInfo={handleInfo} />
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="fifth">
                                        <div className={`${style.order} ${style.fixed}`} >
                                            <Order />
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="sixth">
                                        <div className='bg-light p-3'>
                                            <h6>{listRef.current.VAR000090_wallet_AITSP00000000}: {userInfo ? userInfo.wallet : ''}</h6>
                                        </div>
                                    </Tab.Pane>

                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>



                {/* Financial Infarmation */}

                <Modal className='modalSpiceal' show={showFinancial} fullscreen={true} onHide={handleFinancialClose}>
                    <Modal.Body className='p-0'>
                        <div className={`${style.modelOrder}`}>
                            <div>
                                <div className={`${style.innerModelDiv}`}>
                                    <h5>
                                    {listRef.current.VAR000080_edit_AITSP0000000000} {listRef.current.VAR000068_financial_informatio}
                                    </h5>
                                </div>

                                <form id="form" onSubmit={editFinancial} >
                                    <div className="reg row ">

                                        <div className='inp d-inline-block px-2 col-lg-6 '>
                                            <label className=" my-2">{listRef.current.VAR000083_commercial_reg_AITSP}</label>
                                            <input id="commercial_reg" type="text" className={`form-control  input`}
                                                autoComplete="name" value={financialData.commercial_reg} onChange={handleFinancialChange}
                                                placeholder={listRef.current.VAR000083_commercial_reg_AITSP} />

                                        </div>

                                        <div className='inp d-inline-block px-2 col-lg-6 '>
                                            <label className=" my-2">{listRef.current.VAR000084_tax_number_AITSP0000}</label>
                                            <input id="tax_number" type="text" className={`form-control  input `}
                                                autoComplete="tax_number" value={financialData.tax_number} onChange={handleFinancialChange}
                                                placeholder={listRef.current.VAR000084_tax_number_AITSP0000} />

                                        </div>


                                        <div className='inp d-inline-block px-2 col-lg-12 '>
                                            <label className=" my-2">{listRef.current.VAR000085_notes_AITSP000000000}</label>
                                            <textarea id="notes" type="text"
                                                className="form-control input"
                                                autoComplete="notes" value={financialData.notes} onChange={handleFinancialChange}
                                                placeholder={listRef.current.VAR000085_notes_AITSP000000000} />

                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-center mt-3'>
                                        <button type='submit' className={`${style.btnSend}`}>
                                        {listRef.current.VAR000080_edit_AITSP0000000000}
                                        </button>
                                    </div>

                                </form>


                                <button className={`${style.close}`} onClick={handleFinancialClose} >
                                    <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
                                </button>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>

                {/* Edit bank Infarmation */}

                <Modal className='modalSpiceal' show={showEditBank} fullscreen={true} onHide={handleEditBankClose}>
                    <Modal.Body className='p-0'>
                        <div className={`${style.modelOrder}`}>
                            <div>
                                <div className={`${style.innerModelDiv}`}>
                                    <h5>
                                    {listRef.current.VAR000080_edit_AITSP0000000000} {listRef.current.VAR000086_bank_information_AIT}
                                    </h5>
                                </div>


                                <form onSubmit={EditBank}>
                                    <div className='row'>

                                        <div className='col-lg-6'>
                                            <label className=" my-2">{listRef.current.VAR000102_bank_AITSP0000000000}</label>
                                            <input id="bank_name" type="text" className={`form-control input `} placeholder="Bank Name"
                                                value={bankForEdit.bank_name} onChange={handleBankChange} />

                                        </div>

                                        <div className='col-lg-6 '>
                                            <label className=" my-2">{listRef.current.VAR000101_account_AITSP0000000}</label>
                                            <input id="bank_account" type="text" className={`form-control input `} placeholder="Bank Account"
                                                value={bankForEdit.bank_account} onChange={handleBankChange} />

                                        </div>


                                    </div>

                                    <div className='d-flex justify-content-center mt-3'>
                                        <button type='submit' className={`${style.btnSend}`}>
                                        {listRef.current.VAR000080_edit_AITSP0000000000}
                                        </button>
                                    </div>

                                </form>

                                <button className={`${style.close}`} onClick={handleEditBankClose} >
                                    <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
                                </button>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>

                {/* Add bank Infarmation */}

                <Modal className='modalSpiceal' show={showAddBank} fullscreen={true} onHide={handleAddBankClose}>
                    <Modal.Body className='p-0'>
                        <div className={`${style.modelOrder}`}>
                            <div>
                                <div className={`${style.innerModelDiv}`}>
                                    <h5>
                                    {listRef.current.VAR000087_add_AITSP00000000000} {listRef.current.VAR000086_bank_information_AIT}
                                    </h5>
                                </div>

                                <form onSubmit={AddBank}>
                                    <div className='row'>

                                        <div className='col-lg-6'>
                                            <label className=" my-2">{listRef.current.VAR000102_bank_AITSP0000000000}</label>
                                            <input id="bank_name" type="text" className={`form-control input `} placeholder="Bank Name"
                                                onChange={handleBankChange} />
                                        </div>

                                        <div className='col-lg-6 '>
                                            <label className=" my-2">{listRef.current.VAR000101_account_AITSP0000000}</label>
                                            <input id="bank_account" type="text" className={`form-control input `} placeholder="Bank Account"
                                                onChange={handleBankChange} />
                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-center mt-3'>
                                        <button type='submit' className={`${style.btnSend}`}>
                                        {listRef.current.VAR000087_add_AITSP00000000000}
                                        </button>
                                    </div>

                                </form>

                                <button className={`${style.close}`} onClick={handleAddBankClose} >
                                    <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
                                </button>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>

                {/* Image */}

                <Modal className='modalSpiceal' show={showImge} fullscreen={true} onHide={handleImageClose}>
                    <Modal.Body className='p-0'>
                        <div className={`${style.modelImage}`}>
                            <div>
                                <div className={`${style.modelImageCaption} d-flex justify-content-between`} >
                                    <h3>{caption}</h3>
                                    <button className={`${style.closeIconImage}`} onClick={handleImageClose} >
                                        <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
                                    </button>
                                </div>
                                <div className="">
                                    <img src={`data:image/png;base64,${image}`}
                                        alt="avatar"
                                        className="rounded-2 my-2 w-100"
                                        fluid />
                                </div>
                            </div>


                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </section>

    );
}

export default withAuth(Profile);
