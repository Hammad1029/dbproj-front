
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
  Select,
  MenuItem
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from "yup"
import WithModal from 'components/WithModal';
import httpService, { endpoints } from 'utils/httpService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';

const ProductsTable = ({
  base = "",
  data = [{}],
  name = "",
  getData = () => { },
  columns = [],
  getOrders = () => { },
  ...props
}) => {
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
                  reqBody: values,
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
                        <AddProductToOrder cb={() => {
                          searchData();
                          getOrders();
                          props.closeModal();
                        }} productId={row.product_id} />
                      ),
                      title: `Add to order`,
                    })}>Add to order</Button>
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
                        reqBody: { product_id: row.product_id },
                        successNotif: true,
                        description: `${name} deleted`
                      })
                      if (res) searchData();
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

export default WithModal(ProductsTable)

const AddProductToOrder = ({ cb = () => { }, productId }) => {
  const [orderId, setOrderId] = useState(null);
  const orders = useSelector(state => state.appInfo.orders);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Select
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        fullWidth
        MenuProps={{ style: { zIndex: 999999 } }}
      >
        {orders.map(i => (
          <MenuItem key={i.order_id} value={i.order_id}>{i.order_id} - {i.description}</MenuItem>
        ))}
      </Select>
      <Button sx={{ mt: 2 }} variant="contained" onClick={async () => {
        if (orderId === null) NotificationManager.warning("Please select an order")
        else {
          const res = await httpService({
            base: endpoints.orderProduct.base,
            endpoint: endpoints.orderProduct.add,
            reqBody: {
              order_id: orderId,
              product_id: productId
            },
            successNotif: true,
            description: "Product added"
          })
          if (res) cb()
        }
      }}>Submit</Button>
    </Box>
  )
}

const ModalForm = ({ initialValues = {}, submit = () => { } }) => {
  const suppliers = useSelector(state => state.appInfo.suppliers)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('name is required'),
        description: Yup.string().max(255).required('description is required'),
        category: Yup.string().max(255).required('category is required'),
        quantity: Yup.number().min(0).required('quanitity is required'),
        price: Yup.number().min(0.01).required('price is required'),
        supplier_id: Yup.number().min(0).required('supplier id is required'),
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
                <InputLabel>Product Name</InputLabel>
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
                <InputLabel>Product Description</InputLabel>
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
              <Stack spacing={1}>
                <InputLabel>Product category</InputLabel>
                <OutlinedInput
                  value={values.category}
                  name="category"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.category && errors.category)}
                />
                {touched.category && errors.category && (
                  <FormHelperText error>
                    {errors.category}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Product quantity</InputLabel>
                <OutlinedInput
                  value={values.quantity}
                  name="quantity"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.quantity && errors.quantity)}
                />
                {touched.quantity && errors.quantity && (
                  <FormHelperText error>
                    {errors.quantity}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Product price</InputLabel>
                <OutlinedInput
                  value={values.price}
                  name="price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  error={Boolean(touched.price && errors.price)}
                />
                {touched.price && errors.price && (
                  <FormHelperText error>
                    {errors.price}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={values.supplier_id}
                  name="supplier_id"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={Boolean(touched.supplier_id && errors.supplier_id)}
                  MenuProps={{ style: { zIndex: 999999 } }}
                >
                  {suppliers.map(i => (
                    <MenuItem key={i.supplier_id} value={i.supplier_id}>{i.name}</MenuItem>
                  ))}
                </Select>
                {touched.supplier_id && errors.supplier_id && (
                  <FormHelperText error>
                    {errors.supplier_id}
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