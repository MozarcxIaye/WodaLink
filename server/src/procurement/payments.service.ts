import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  // Use Khalti's sandbox credentials for development mode
  private readonly KHALTI_SECRET_KEY = 'key 05bf95cc57244045b8df5fad06748dab'; 
  private readonly KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';

  async initiateKhaltiPayment(requestId: string, amountInNpr: number) {
    try {
      const response = await axios.post(
        this.KHALTI_INITIATE_URL,
        {
          return_url: 'http://localhost:3000/procurement/payment/callback', // Where Khalti redirects after completion
          website_url: 'http://localhost:3000',
          amount: amountInNpr * 100, // Convert NPR to Paisa (e.g., 500 NPR = 50000 Paisa)
          purchase_order_id: requestId,
          purchase_order_name: `Document Procurement Job: ${requestId}`,
        },
        {
          headers: {
            Authorization: this.KHALTI_SECRET_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      // Returns the checkout payment page URL for the frontend redirection
      return { paymentUrl: response.data.payment_url };
    } catch (error: any) {
      throw new BadRequestException(`Khalti Initiation Failed: ${error.response?.data?.detail || error.message}`);
    }
  }
}