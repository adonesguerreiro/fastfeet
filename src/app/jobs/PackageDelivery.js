import Mail from '../../lib/Mail';

class PackageDelivery {
  get key() {
    return 'PackageDelivery';
  }

  async handle({ data }) {
    const { dataOrder } = data;
    await Mail.sendMail({
      to: `${dataOrder.deliverymans.name} <${dataOrder.deliverymans.email}>`,
      subject: 'Nova entrega',
      template: 'order',
      context: {
        deliveryman: dataOrder.deliverymans.name,
        recipient: dataOrder.recipients.name,
        address: `${dataOrder.recipients.street}
          ${dataOrder.recipients.number}
          ${dataOrder.recipients.state}
          ${dataOrder.recipients.city}
          ${dataOrder.recipients.zipcode}`,
        product: dataOrder.product,
      },
    });
  }
}

export default new PackageDelivery();
