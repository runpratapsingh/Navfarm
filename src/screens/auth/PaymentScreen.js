import React, {useEffect, useState} from 'react';
import {View, Button, Alert, StyleSheet} from 'react-native';
import {
  StripeProvider,
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const {confirmPayment} = useStripe();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch clientSecret from your backend when the app loads
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/create-payment-intent',
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({amount: 1000}), // $10.00 in cents
          },
        );
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          Alert.alert('Error', 'Failed to initialize payment');
        }
      } catch (error) {
        Alert.alert('Error', `Backend connection failed: ${error.message}`);
      }
    };

    fetchPaymentIntent();
  }, []);

  // Handle the payment submission
  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment not ready yet. Please wait.');
      return;
    }

    setLoading(true);
    try {
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: 'Test User', // You can make this dynamic with user input
          },
        },
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        Alert.alert(
          'Success',
          `Payment of $${paymentIntent.amount / 100} succeeded!`,
        );
      }
    } catch (error) {
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StripeProvider publishableKey="pk_test_51RA7gO2NWSqtyF5WNJdU94bHvdYjbOPzFHhVoSRAYc9UZ8mHqmM7KAoplbCa08ifbHZfbmTpFdT8ia61XurNUjUr00pUZWrHSd">
      <View style={styles.container}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{number: '4242 4242 4242 4242'}}
          style={styles.cardField}
          onCardChange={cardDetails => {
            console.log('Card details:', cardDetails); // Optional: Log card input
          }}
        />
        <Button
          title={loading ? 'Processing...' : 'Pay $10.00'}
          onPress={handlePayment}
          disabled={loading || !clientSecret}
        />
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
});

export default PaymentScreen;
