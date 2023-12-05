import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

const WithModal = (Component) => function HOC(props) {
    const defaultModalSettings = {
        bodyComp: <></>,
        showBody: true,
        title: "",
        onSubmit: () => { },
        onCancel: () => { },
        showSubmit: false,
        showCancel: false
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSettings, setModalSettings] = useState({});

    const toggleModal = () => setModalOpen((prevVal) => !prevVal);

    const openModal = (settings) => {
        setModalSettings(settings);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalSettings({});
        onCancel();
        setModalOpen(false);
    };

    const { bodyComp, showBody, showSubmit, showCancel, title, onSubmit, onCancel } = {
        ...defaultModalSettings,
        ...modalSettings,
    };

    return (
        <>
            <Component
                toggleModal={toggleModal}
                openModal={openModal}
                closeModal={closeModal}
                {...props}
            />
            <Dialog open={modalOpen} onClose={closeModal} sx={{ zIndex: 9999 }}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ marginRight: 2 }}>{title}</Typography>
                    <Typography variant="h4" onClick={closeModal}>X</Typography>
                </DialogTitle>
                {showBody && <DialogContent>{bodyComp}</DialogContent>}
                <DialogActions>
                    {showSubmit &&
                        <Button variant="contained" onClick={onSubmit}>
                            Confirm
                        </Button>}
                    {showCancel &&
                        <Button variant="contained" onClick={closeModal}>
                            Cancel
                        </Button>}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WithModal;
