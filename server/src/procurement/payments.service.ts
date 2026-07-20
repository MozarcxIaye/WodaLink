import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  // Use Khalti's sandbox credentials for development mode
  private readonly KHALTI_SECRET_KEY = 'key 1b1cbe6e986e43d69f42fbbb8c725780';
  private readonly KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';

  async initiateKhaltiPayment(requestId: string, amountInNpr: number) {
    try {
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const returnUrl = process.env.KHALTI_RETURN_URL || `${frontendUrl}/procurement/payment/callback`;
      const websiteUrl = process.env.KHALTI_WEBSITE_URL || frontendUrl;
      const purchaseOrderId = String(requestId);
      const amountPaisa = Math.round(amountInNpr * 100);

      if (!Number.isFinite(amountPaisa) || amountPaisa <= 0) {
        throw new BadRequestException('Invalid escrow amount for Khalti payment initiation.');
      }

      const response = await axios.post(
        this.KHALTI_INITIATE_URL,
        {
          return_url: returnUrl, // Where Khalti redirects after completion to the frontend
          website_url: websiteUrl,
          amount: amountPaisa,
          purchase_order_id: purchaseOrderId,
          purchase_order_name: `Document Procurement Job: ${purchaseOrderId}`,
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
      const errorDetail = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      throw new BadRequestException(`Khalti Initiation Failed: ${errorDetail}`);
    }
  }
}