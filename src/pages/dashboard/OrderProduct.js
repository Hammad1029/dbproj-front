
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

    ButtonGroup,
} from '@mui/material';
import httpService, { endpoints } from 'utils/httpService';
import { useEffect, useState } from 'react';

const OrderProduct = ({ orderId = "1", updateProducts, getOrders }) => {
    const [products, setProducts] = useState([]);
    const setData = async () => {
        const res = await httpService({
            base: endpoints.orderProduct.base,
            endpoint: endpoints.orderProduct.list,
            reqBody: { order_id: orderId },
        })
        if (res) {
            setProducts(res);
            getOrders();
            updateProducts();
        }
    }

    useEffect(() => {
        setData()
    }, [])


    return (
        <Box sx={{ padding: 1 }}>
            {Array.isArray(products) && products.length > 0 ?
                <TableContainer
                    sx={{
                        position: 'relative',
                        display: 'block',
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
                                {["Order ID", "Product ID", "Product Quanitity", "Product Name", "Available Quantity"].map((headCell) => (
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
                            {products.map((row, i) => (
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
                                            <Button color="error" onClick={async () => {
                                                const res = await httpService({
                                                    base: endpoints.orderProduct.base,
                                                    endpoint: endpoints.orderProduct.delete,
                                                    reqBody: {
                                                        order_id: orderId,
                                                        product_id: row.product_id
                                                    },
                                                    successNotif: true,
                                                    description: "Product deleted"
                                                })
                                                if (res) setData();
                                            }}>Delete One</Button>
                                            <Button onClick={async () => {
                                                const res = await httpService({
                                                    base: endpoints.orderProduct.base,
                                                    endpoint: endpoints.orderProduct.add,
                                                    reqBody: {
                                                        order_id: orderId,
                                                        product_id: row.product_id
                                                    },
                                                    successNotif: true,
                                                    description: "Product added"
                                                })
                                                if (res) setData();
                                            }}>Add One</Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Typography variant="h3">No products added to this order</Typography>}
        </Box >
    );
}

export default OrderProduct
