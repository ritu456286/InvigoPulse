import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';

const cardData = [
  {
    title: "Earnings",
    amount: "Rs. 1,00,000",
  },
  {
    title: "Expenses",
    amount: "Rs. 50,000",
  },
  {
    title: "Balance",
    amount: "Rs. 50,000",
  }
];

const StyledCard = styled(Card)({
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const CardItem = ({ title, amount, index }) => (
  <StyledCard variant="outlined" sx={{ backgroundColor: index % 2 === 0 ? '#c51e3a' : '#c51e3a', boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.3)', margin: '10px', outline: '2px solid grey', width: '300px', height: '100px' }}>
    <CardContent>
      <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', fontSize: '1.2rem' }}>
        {title} <AttachMoneyIcon sx={{ fontSize: '2rem' }} />
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
        {amount}
      </Typography>
    </CardContent>
  </StyledCard>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ flexGrow: 1, marginTop: 4, display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={2}>
        {cardData.map((data, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardItem title={data.title} amount={data.amount} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
