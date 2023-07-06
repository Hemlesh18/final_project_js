import { Alert, Button, Fade } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import CartItemCard from '../CartItemCard/CartItemCard';
import { cartContext, updateCartContext } from "../../../App";
import { deliveryFormContext } from '../Cart';
import { useNavigate } from 'react-router-dom';
import { localStorageHandler } from '../../../assets/FakeData/FakeData';
 import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

{/* <script async
  src="https://js.stripe.com/v3/buy-button.js">
</script>

<stripe-buy-button
  buy-button-id="buy_btn_1NOdu5HOa8U2jn8xy9OWJSOB"
  publishable-key="pk_test_51NMDsdHOa8U2jn8x68aGq3WKQ0oo8huZikmzznZAajSa17ypeuxEIpCcHcR8QHDQLpo5sgwVTC9tIzzNrcXxlPrB00JTpBqSBl"
>
</stripe-buy-button> */}
const CartSummary = () => {

    // Get States From Context
    const [cart, setCart] = useContext(cartContext);
    const [updatedCart, setUpdatedCart] = useContext(updateCartContext);
    const { isUserFilledForm, userDeliveryDetails } = useContext(deliveryFormContext);
    const [deliveryDetails, setDeliveryDetails] = userDeliveryDetails;
    const [isUserFilledDeliveryForm, setIsUserFilledDeliveryForm] = isUserFilledForm;

    const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    // Manage PlaceOrder Btn
    const [isPlaceOrderBtnDisable, setIsPlaceOrderBtnDisable] = useState(true)
    useMemo(() => {
        if (updatedCart.length > 0 && isUserFilledDeliveryForm) {
            setIsPlaceOrderBtnDisable(false)
        } else {
            setIsPlaceOrderBtnDisable(true)
        }
    }, [updatedCart, isUserFilledDeliveryForm])

    // Generated fake estimated delivery time
    const [deliveryTime] = useState(Math.round(Math.random() * 90) + 10)

    /// Calculating The Bill ///
    // Sub-Total
    const subTotal = updatedCart.reduce((total, cartItem) => Number.parseInt(total + cartItem.total), 0)
    // Tax 2.50%
    const tax = Number.parseInt(((subTotal / 100) * 2.5).toFixed(2));
    // Delivery Charge
    const deliveryCharge = cart.length > 0 ? 2.99 : 0;
    // Total
    const total = (subTotal + deliveryCharge + tax).toFixed(2);


    // Order Placed Handler
    const handlePlaceOrder = () => {

        if (updatedCart.length > 0) {

            // navigate('/track-order')

            const orderDetails = {
                delivery: {
                    restaurant_location: 'Quatre Bornes Market Fair,PFMH+9XQ, Quatre Bornes',
                    customer_location: deliveryDetails.address
                },
                cart: updatedCart.map(meal => ({ name: meal.name, quantity: meal.quantity, total: meal.total })),
                total_bill: total
            }
            localStorageHandler('set', 'orderDetails', orderDetails)
        }
        else Alert("Please add items to your basket")
    }
// handleCashPayment
const handleCashPayment =() =>{
    navigate('/track-order')

}



    return (
            <div className='col space-y-6 2xl:max-w-[25rem] lg:max-w-[21rem] w-full max-w-[25rem] mx-auto'>
                {/* Delivery details */}
                <ul className="text-sm space-y-3">
                    {/* Restaurant Location */}
                    <li>From <strong>RED ONION Quatre Bornes</strong></li>

                    {/* Estimated Delivery Time */}
                    <li>Estimated delivery time:

                        {isUserFilledDeliveryForm ?
                            ` ${deliveryTime} ` : ' ... '}

                        Minutes</li>

                    {/* User Location */}
                    <li>To
                        <strong>
                            {isUserFilledDeliveryForm ?
                                ` ${deliveryDetails.address} ` : ' ... '}
                        </strong>
                    </li>
                </ul>

                {/* Cart_Item Cards*/}
                {cart.length > 0 ?
                    <div style={{ scrollbarWidth: 'thin' }} className='col space-y-3.5 max-h-[15rem] px-0.5 pb-2 w-full overflow-auto'>
                        {
                            cart.map(meal => (
                                <CartItemCard key={meal.id} meal={meal} />
                            ))
                        }
                    </div>

                    // Cart_item Skeleton
                    : <Fade in={true}>
                        <div className='h-28 rounded-xl w-full bg-gray-100' />
                    </Fade>}

                {/* Total Bill */}
                <table className='table-auto h-28 text-sm w-full'>
                    <tbody>
                        <TableRow title="Subtotal" amount={subTotal} />
                        <TableRow title="Tax" amount={tax} />
                        <TableRow title="Delivery charge" amount={deliveryCharge} />
                        <TableRow title="Total" amount={total} />
                    </tbody>
                </table>

                {/* Place Order Button */}

                <Button onClick={handleOpen}><Button
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={isPlaceOrderBtnDisable}
                    sx={{ textTransform: 'capitalize' }}
                    variant='contained'
                    color='error'>
                    Place Order
                </Button></Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Payment method:
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            <Button
            onClick={handleCashPayment}
                sx={{ textTransform: 'capitalize' }}
                variant='contained'
                color='error'
                >
                CASH
                </Button>
                <br></br>
            <Button
            onClick="location.href = 'https://buy.stripe.com/test_aEU9Cwdzd7Ek6pGeUU'"
                sx={{ textTransform: 'capitalize' }}
                variant='contained'
                color='error'
                >
                CARD
                </Button>
          </Typography>
        </Box>
      </Modal>




            </div>
    )
}


// This sub-component will use inside Bill Table
const TableRow = ({ title, amount }) => (
    <tr className={` ${title === 'Total' && 'text-lg'} font-medium`}>
        <td >{title}</td>
        <td>$ {amount}</td>
    </tr>
)

export default CartSummary;