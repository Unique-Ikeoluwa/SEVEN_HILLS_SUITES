/**
 * Premium visual receipt generator for Seven Hills Suites
 */
function renderReceiptHtml({ booking, payment, apartment, user }) {
  const receiptNo = payment?.transaction_reference || `REC-${booking.id.substring(0, 8).toUpperCase()}`;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const paymentMethod = payment?.payment_method?.toUpperCase() || "CREDIT CARD";
  const currency = payment?.currency || "USD";
  const amount = payment?.amount || booking.total_price;
  
  // Calculate night stay duration
  let nights = "N/A";
  if (booking.check_in && booking.check_out) {
    try {
      const checkInDate = new Date(booking.check_in);
      const checkOutDate = new Date(booking.check_out);
      const diffTime = Math.abs(checkOutDate - checkInDate);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      console.error("Error calculating stay nights:", e);
    }
  }

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left;">
      <div style="background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 32px; text-align: center; border-bottom: 4px solid #f59e0b;">
        <span style="font-size: 11px; font-weight: 700; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 8px;">Official Payment Receipt</span>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">SEVEN HILLS SUITES</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Executive Luxury Accommodations</p>
      </div>
      
      <div style="padding: 32px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <h4 style="margin: 0 0 4px 0; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Receipt Number</h4>
            <span style="font-size: 15px; font-weight: 700; color: #0f172a; font-family: monospace;">${receiptNo}</span>
          </div>
          <div style="text-align: right;">
            <h4 style="margin: 0 0 4px 0; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Date Issued</h4>
            <span style="font-size: 15px; font-weight: 600; color: #0f172a;">${date}</span>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700; border-left: 3px solid #f59e0b; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Profile</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 35%;">Guest Name:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${user?.fullName || 'Valued Guest'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Email Address:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${user?.email || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Phone Number:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${user?.phone_no || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Method of Payment:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-transform: uppercase;">${paymentMethod}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700; border-left: 3px solid #f59e0b; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Suite Reservation</h3>
          <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px;">
            <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">${apartment?.title || 'Luxury Suite'}</h4>
            <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px;">📍 ${apartment?.location || 'Seven Hills Premier Suite'}</p>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 13px;">
              <div>
                <span style="color: #64748b; display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Check-In</span>
                <strong style="color: #0f172a; font-size: 14px;">${booking.check_in}</strong>
              </div>
              <div style="text-align: right;">
                <span style="color: #64748b; display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Check-Out</span>
                <strong style="color: #0f172a; font-size: 14px;">${booking.check_out}</strong>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700; border-left: 3px solid #f59e0b; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Billing Details</h3>
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="text-align: left; padding: 12px 16px; color: #64748b; font-weight: 600;">Description</th>
                <th style="text-align: center; padding: 12px 16px; color: #64748b; font-weight: 600; width: 20%;">Qty</th>
                <th style="text-align: right; padding: 12px 16px; color: #64748b; font-weight: 600; width: 30%;">Amount</th>
              </tr>
              <tr>
                <td style="padding: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; line-height: 1.4;">
                  <strong style="color: #1e293b;">Accommodation Reservation</strong><br/>
                  <span style="font-size: 12px; color: #64748b;">${apartment?.apartment_type || 'Executive'} booking package</span>
                </td>
                <td style="text-align: center; padding: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                  ${nights} ${nights === 1 ? 'Night' : 'Nights'}
                </td>
                <td style="text-align: right; padding: 16px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                  ${currency} ${amount}
                </td>
              </tr>
              <tr style="background-color: #fffbeb;">
                <td colspan="2" style="padding: 16px; color: #0f172a; font-weight: 700; border-top: 1px solid #fef3c7;">Total Paid Amount</td>
                <td style="text-align: right; padding: 16px; color: #b45309; font-weight: 800; font-size: 18px; border-top: 1px solid #fef3c7;">
                  ${currency} ${amount}
                </td>
              </tr>
            </table>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 24px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px;">
          <span style="color: #065f46; font-size: 14px; font-weight: 700;">✓ Payment Verified & Secured Successfully</span>
        </div>
      </div>
      
      <div style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 500;">Thank you for your patronage at Seven Hills Suites.</p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">If you need assistance, please feel free to email our concierges at support@sevenhills.com</p>
      </div>
    </div>
  `;
}

module.exports = { renderReceiptHtml };
