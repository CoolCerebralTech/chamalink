interface Member {
  name: string;
  amount: number;
  status: string; // 'pending' | 'confirmed'
}

export class WhatsappUtil {
  static generateUpdate(title: string, members: Member[]): string {
    // 1. Calculate Totals
    const totalCollected = members
      .filter((m) => m.status === 'confirmed')
      .reduce((sum, m) => sum + m.amount, 0);

    const pendingCount = members.filter((m) => m.status === 'pending').length;

    // 2. Format Currency (Simple KES formatter)
    const fmt = (n: number) => `KES ${n.toLocaleString()}`;

    // 3. Separate Lists
    const paidList = members
      .filter((m) => m.status === 'confirmed')
      .map((m) => `✅ *${m.name}* · ${fmt(m.amount)}`)
      .join('\n');

    const pendingList = members
      .filter((m) => m.status === 'pending')
      .map((m) => `⏳ ${m.name} · ${fmt(m.amount)}`) // No bold for pending, subtle pressure
      .join('\n');

    // 4. Build the Creative Message
    const header = `🚀 *CONTRIBUTION UPDATE* 🚀`;
    const subHeader = `📌 Group: _${title}_`;
    const moneyStats = `💰 *Total Collected: ${fmt(totalCollected)}*`;

    let body = '';
    if (paidList) {
      body += `\n\n*Confirmed Payments:*\n${paidList}`;
    }

    if (pendingList) {
      body += `\n\n*Pending / Pledges:*\n${pendingList}`;
    }

    // 5. Dynamic Footer based on progress
    let footer = '';
    if (pendingCount > 0) {
      footer = `\n\n_Waiting on ${pendingCount} more... let's keep it moving!_ 💪`;
    } else {
      footer = `\n\n_All in! You guys are amazing!_ 🎉`;
    }

    return `${header}\n${subHeader}\n${moneyStats}${body}${footer}`;
  }
}
