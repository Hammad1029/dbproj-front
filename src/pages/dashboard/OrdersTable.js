
// material-ui
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  ButtonGroup,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from "yup"
import WithModal from 'components/WithModal';
import httpService from 'utils/httpService';
import { useEffect, useState } from 'react';
import OrderProduct from './OrderProduct';

const OrdersTable = ({ base = "", data = [{}], name = "", getData = () => { }, columns = [], updateProducts, ...props }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    searchData();
  }, [])

  const searchData = (text = "") => {
    setSearch(text);
    getData(text);
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">{name}</Typography>
        <TextField variant="outlined" label="Search" value={search} onChange={(e) => searchData(e.target.value)} />
        <Button variant="contained" onClick={() => (
          props.openModal({
            bodyComp: (
              <ModalForm submit={async (values) => {
                const res = await httpService({
                  base: base.base,
                  endpoint: base.create,
                  reqBody: { ...values, contact: "0" + values.contact },
                  successNotif: true,
                  description: `${name} created`
                })
                if (res) {
                  searchData();
                  props.closeModal();
                }
              }} />
            ),
            title: `Create ${name}`,
          }))}>
          Create
        </Button>
      </Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((headCell) => (
                <TableCell
                  key={headCell}
                  align="left"
                  padding='normal'
                >
                  {headCell}
                </TableCell>
              ))}
              <TableCell
                key="actions"
                align="right"
                padding='normal'
              >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}
                hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {Object.keys(row).map((cell) => (
                  <TableCell
                    key={cell}
                    align="left"
                    padding='normal'
                  >
                    {row[cell]}
                  </TableCell>
                ))}
                <TableCell
                  key="actions"
                  align="right"
                  padding='normal'
                >
                  <ButtonGroup variant="contained">
                    <Button onClick={() => props.openModal({
                      bodyComp: (
                        <OrderProduct orderId={row.order_id} updateProducts={updateProducts} getOrders={getData} />
                      ),
                      title: `View products`,
                    })}>View Products</Button>
                    <Button sx={{ backgroundColor: "orange" }} onClick={() => props.openModal({
                      bodyComp: (
                        <ModalForm initialValues={row} submit={async (values) => {
                          const res = await httpService({
                            base: base.base,
                            endpoint: base.update,
                            reqBody: values,
                            successNotif: true,
                            description: `${name} updated`
                          })
                          if (res) {
                            searchData();
                            props.closeModal();
                          }
                        }} />
                      ),
                      title: `Update ${name}`,
                    })}>Update</Button>
                    <Button color="error" onClick={async () => {
                      const res = await httpService({
                        base: base.base,
                        endpoint: base.delete,
                        reqBody: { order_id: row.order_id },
                        successNotif: true,
                        description: `${name} deleted`
                      })
                      if (res) {
                        searchData();
                        updateProducts();
                      }
                    }}>Delete</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box >
  );
}

export default WithModal(OrdersTable)

const ModalForm = ({ initialValues = {}, submit = () => { } }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('name is required'),
        contact: Yup.string().max(255).required('contact is required'),
        shipping_address: Yup.string().max(255).required('contact is required'),
        description: Yup.string().max(255).required('contact is required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setStatus({ success: false });
          setSubmitting(false);
          submit(values)
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Customer Name</InputLabel>
                <OutlinedInput
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.name && errors.name)}
                />
                {touched.name && errors.name && (
                  <FormHelperText error>
                    {errors.name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel >Contact</InputLabel>
                <OutlinedInput
                  value={values.contact}
                  name="contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  error={Boolean(touched.contact && errors.contact)}
                />
                {touched.contact && errors.contact && (
                  <FormHelperText error>
                    {errors.contact}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Shipping Address</InputLabel>
                <OutlinedInput
                  value={values.shipping_address}
                  name="shipping_address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.shipping_address && errors.shipping_address)}
                />
                {touched.shipping_address && errors.shipping_address && (
                  <FormHelperText error>
                    {errors.shipping_address}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  value={values.description}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.description && errors.description)}
                />
                {touched.description && errors.description && (
                  <FormHelperText error>
                    {errors.description}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">Submit</Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  )
}