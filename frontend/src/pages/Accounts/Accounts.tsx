import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { createAccount, getAccounts, updateAccount } from "@/api/accounts";
import { AccountCard } from "@/components/Account/AccountCard";
import { AccountDistribution } from "@/components/Account/AccountDistribution";
import { AccountForm } from "@/components/Account/AccountForm";
import { AccountsBalance } from "@/components/Account/AccountsBalance";
import { Button } from "@/components/ui/button";
import type { Account, CreateAccountData } from "@/types/account";

import "./Accounts.scss";

const ACCOUNTS_QUERY_KEY = ["accounts"];


export const Accounts = () => {
  const queryClient = useQueryClient();
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: getAccounts,
  });
  const activeAccounts = accounts.filter((account) => !account.isArchived);

  const refreshAccounts = () =>
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: async () => {
      await refreshAccounts();
      closeForm();
      toast.success("Счёт добавлен");
    },
    onError: () => toast.error("Не удалось добавить счёт"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAccountData>;
    }) => updateAccount(id, data),
    onSuccess: async () => {
      await refreshAccounts();
      closeForm();
      toast.success("Изменения сохранены");
    },
    onError: () => toast.error("Не удалось сохранить изменения"),
  });

  const defaultMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      updateAccount(id, { isDefault: true }),
    onSuccess: async () => {
      await refreshAccounts();
      toast.success("Основной счёт обновлён");
    },
    onError: () => toast.error("Не удалось выбрать основной счёт"),
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) =>
      updateAccount(id, { isArchived }),
    onSuccess: async (_account, variables) => {
      await refreshAccounts();
      toast.success(
        variables.isArchived
          ? "Счёт перемещён в архив"
          : "Счёт восстановлен из архива",
      );
    },
    onError: () => toast.error("Не удалось изменить состояние счёта"),
  });

  function closeForm() {
    setIsFormOpen(false);
    setEditingAccount(undefined);
  }

  const openCreateForm = () => {
    setEditingAccount(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleSave = async (data: CreateAccountData) => {
    if (editingAccount) {
      await updateMutation.mutateAsync({ id: editingAccount.id, data });
      return;
    }

    await createMutation.mutateAsync(data);
  };

  const handleSetDefault = (account: Account) => {
    defaultMutation.mutate({ id: account.id });
  };

  const handleArchiveToggle = (account: Account) => {
    const isArchived = !account.isArchived;
    archiveMutation.mutate({ id: account.id, isArchived });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="accounts-page">
      <header className="accounts-page__header mb-9">
        <div>
          <h1 className="accounts-page__title">Счета</h1>
          <p className="accounts-page__subtitle">
            Управляйте счетами и следите за своими средствами
          </p>
        </div>

        <Button
          type="button"
          variant="accent"
          className="accounts-page__add-button"
          onClick={openCreateForm}
        >
          <Plus aria-hidden="true" />
          Добавить счёт
        </Button>
      </header>

      <div className="accounts-page__layout">
        <div className="accounts-page__main">
          {isLoading && (
            <div className="accounts-page__state account-panel" role="status">
              Загружаем счета…
            </div>
          )}

          {isError && (
            <div className="accounts-page__state accounts-page__state--error account-panel">
              <p>Не удалось загрузить счета.</p>
              <Button
                variant="ghost"
                type="button"
                onClick={() => void refetch()}
              >
                Повторить
              </Button>
            </div>
          )}

          {!isLoading && !isError && activeAccounts.length === 0 && (
            <div className="accounts-page__empty account-panel">
              <div className="accounts-page__empty-icon">
                <Plus aria-hidden="true" />
              </div>
              <h3>Здесь появятся ваши счета</h3>
              <p>Добавьте первый счёт, чтобы начать вести личные финансы.</p>
              <Button type="button" variant="accent" onClick={openCreateForm}>
                Добавить счёт
              </Button>
            </div>
          )}

          {!isLoading && !isError && activeAccounts.length > 0 && (
            <div className="accounts-page__cards">
              {activeAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <AccountCard
                    account={account}
                    onEdit={openEditForm}
                    onArchiveToggle={handleArchiveToggle}
                    onSetDefault={handleSetDefault}
                    isArchiving={
                      archiveMutation.isPending &&
                      archiveMutation.variables?.id === account.id
                    }
                    isUpdatingDefault={
                      defaultMutation.isPending &&
                      defaultMutation.variables?.id === account.id
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}

          <section
            className="accounts-page__activity account-panel"
            aria-labelledby="account-activity-title"
          >
            <div className="accounts-page__activity-header">
              <div>
                <h2 id="account-activity-title">Последние операции</h2>
                <p>История операций по всем счетам</p>
              </div>
              <span className="accounts-page__soon">Скоро</span>
            </div>
            <div className="accounts-page__activity-empty">
              <span className="accounts-page__activity-icon">
                <ArrowLeftRight size={19} aria-hidden="true" />
              </span>
              <p>
                Операции появятся здесь, когда будет подключён учёт доходов и
                расходов.
              </p>
            </div>
          </section>
        </div>

        <aside className="accounts-page__aside" aria-label="Сводка по счетам">
          <AccountsBalance accounts={activeAccounts} isLoading={isLoading} />
          <AccountDistribution accounts={activeAccounts} isLoading={isLoading} />
          <div className="accounts-page__tip account-panel">
            <span className="accounts-page__tip-mark" aria-hidden="true">
              ✦
            </span>
            <p className="accounts-page__tip-title">
              Финансовая ясность начинается с простого
            </p>
            <p>
              Разделяйте накопления и повседневные расходы по разным счетам.
            </p>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <AccountForm
            account={editingAccount}
            isPending={isSaving}
            onClose={closeForm}
            onSubmit={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
