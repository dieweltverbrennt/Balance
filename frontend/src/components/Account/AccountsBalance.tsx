import { CheckCircle2, WalletCards } from "lucide-react";

import type { Account } from "@/types/account";
import { formatAccountAmount, getCurrencyTotals } from "./account.utils";

interface AccountsBalanceProps {
  accounts: Account[];
  isLoading: boolean;
}

export const AccountsBalance = ({
  accounts,
  isLoading,
}: AccountsBalanceProps) => {
  const activeAccounts = accounts.filter((account) => !account.isArchived);
  const totals = getCurrencyTotals(accounts);

  return (
    <section
      className="accounts-balance account-panel"
      aria-labelledby="accounts-balance-title"
    >
      <div className="accounts-balance__heading">
        <span className="accounts-balance__icon">
          <WalletCards size={18} aria-hidden="true" />
        </span>
        <span>Сводка</span>
      </div>

      <h2 id="accounts-balance-title">Начальные остатки</h2>
      <p className="accounts-balance__caption">По активным счетам</p>

      {isLoading ? (
        <div className="accounts-balance__loading" role="status">
          Загружаем…
        </div>
      ) : totals.length === 0 ? (
        <p className="accounts-balance__empty">
          Добавьте счёт, чтобы увидеть сводку
        </p>
      ) : (
        <div className="accounts-balance__totals">
          {totals.map(({ currency, total }) => (
            <strong key={currency}>
              {formatAccountAmount(total, currency)}
            </strong>
          ))}
        </div>
      )}

      <div className="accounts-balance__trend">
        <span className="accounts-balance__trend-icon">
          <CheckCircle2 size={16} aria-hidden="true" />
        </span>
        <span>{activeAccounts.length} активных</span>
      </div>

      <p className="accounts-balance__disclaimer">
        Сумма начальных остатков. Текущий баланс будет учитывать операции.
      </p>
    </section>
  );
};
