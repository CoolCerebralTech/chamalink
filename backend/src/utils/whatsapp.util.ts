export function formatWhatsappSummary(contribution, members) {
  let text = `ChamaLink Update – ${contribution.title}\n\n`;

  let total = 0;

  members.forEach((m) => {
    const icon = m.status === 'confirmed' ? '✔' : '⏳';
    if (m.status === 'confirmed') total += m.amount;

    text += `${icon} ${m.name} – KES ${m.amount}\n`;
  });

  text += `\nTotal Collected: KES ${total}`;

  return text;
}
