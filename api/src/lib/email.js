const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const sendOrderConfirmation = async (order, customer) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;">${item.product.name}</td>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;text-align:center;">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;text-align:right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;text-align:right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('')

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:0;background:#FAF8F5;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:40px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:0.1em;color:#383D3B;margin:0;">ROSE MONTEIRO</h1>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:14px;color:#B75D45;margin:4px 0 0;">Joias</p>
      </div>
      <!-- Body -->
      <div style="background:#ffffff;padding:40px;border:0.5px solid #E6D3C5;">
        <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#383D3B;margin:0 0 8px;">Pedido confirmado ✓</h2>
        <p style="font-size:13px;color:#888;margin:0 0 32px;">Pedido <strong style="color:#383D3B;">${order.orderNumber}</strong></p>
        <p style="font-size:14px;color:#383D3B;margin:0 0 24px;">Olá, <strong>${customer.name}</strong>! Recebemos seu pedido e em breve entraremos em contato pelo WhatsApp para confirmar os detalhes.</p>
        <!-- Items -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#F5F0EA;">
              <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9B8733;font-weight:500;">Produto</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9B8733;font-weight:500;">Qtd</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9B8733;font-weight:500;">Unit.</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9B8733;font-weight:500;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <!-- Total -->
        <div style="border-top:1px solid #E6D3C5;padding-top:16px;text-align:right;">
          <span style="font-size:13px;color:#888;">Total: </span>
          <span style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#383D3B;">${formatCurrency(order.total)}</span>
        </div>
        <!-- Delivery -->
        <div style="margin-top:24px;padding:16px;background:#F5F0EA;border-left:3px solid #9B8733;">
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9B8733;margin:0 0 6px;">Entrega</p>
          <p style="font-size:13px;color:#383D3B;margin:0;">${order.deliveryMethod === 'PICKUP' ? 'Retirada no ateliê' : 'Entrega no endereço'}</p>
        </div>
        <p style="font-size:12px;color:#888;margin:24px 0 0;line-height:1.7;">Em caso de dúvidas, entre em contato pelo WhatsApp ou responda este e-mail.</p>
      </div>
      <!-- Footer -->
      <div style="text-align:center;margin-top:32px;">
        <p style="font-size:11px;color:#aaa;letter-spacing:0.1em;">ROSE MONTEIRO JOIAS · Ponta Grossa, PR</p>
        <p style="font-size:11px;color:#aaa;">Cerâmica artesanal com design autoral</p>
      </div>
    </div>
  </body>
  </html>`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: customer.email || process.env.EMAIL_ADMIN,
    subject: `Pedido ${order.orderNumber} confirmado — Rose Monteiro Joias`,
    html,
  })
}

const sendNewOrderNotification = async (order, customer) => {
  const itemsList = order.items.map(i => `• ${i.product.name} × ${i.quantity} — ${formatCurrency(i.total)}`).join('\n')

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
    <h2 style="color:#B75D45;">🛍️ Novo pedido recebido!</h2>
    <p><strong>Pedido:</strong> ${order.orderNumber}</p>
    <p><strong>Cliente:</strong> ${customer.name}</p>
    <p><strong>Telefone:</strong> ${customer.phone}</p>
    <p><strong>Entrega:</strong> ${order.deliveryMethod === 'PICKUP' ? 'Retirada' : 'Envio'}</p>
    ${order.notes ? `<p><strong>Observações:</strong> ${order.notes}</p>` : ''}
    <hr style="border:0.5px solid #E6D3C5;margin:16px 0;">
    <pre style="font-size:13px;color:#383D3B;">${itemsList}</pre>
    <hr style="border:0.5px solid #E6D3C5;margin:16px 0;">
    <p style="font-size:18px;font-weight:bold;color:#383D3B;">Total: ${formatCurrency(order.total)}</p>
    <p><strong>Pagamento:</strong> ${order.paymentMethod || 'A definir'}</p>
  </div>`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN,
    subject: `🛍️ Novo pedido ${order.orderNumber} — ${formatCurrency(order.total)}`,
    html,
  })
}

module.exports = { sendOrderConfirmation, sendNewOrderNotification }
