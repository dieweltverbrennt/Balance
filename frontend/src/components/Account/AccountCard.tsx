import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import type { Account } from "@/types/account";
import {
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  formatAccountAmount,
} from "./account.utils";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onArchiveToggle: (account: Account) => void;
  onSetDefault: (account: Account) => void;
  isArchiving: boolean;
  isUpdatingDefault: boolean;
}

export const AccountCard = ({
  account,
  onEdit,
  onArchiveToggle,
  onSetDefault,
  isArchiving,
  isUpdatingDefault,
}: AccountCardProps) => {
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const Icon = ACCOUNT_TYPE_ICONS[account.type];

  useEffect(() => {
    if (!isConfirmingArchive) return;

    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsConfirmingArchive(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isConfirmingArchive]);

  return (
    <motion.article
      className={`account-card account-panel${account.isDefault ? " account-card--default" : ""}${account.isArchived ? " account-card--archived" : ""}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
    >
      <div className="account-card__top">
        <span
          className={`account-card__icon account-card__icon--${account.type}`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="account-card__actions">
          {account.isDefault && (
            <span className="account-card__badge">Основной</span>
          )}
          <details className="account-card__menu" ref={menuRef}>
            <summary aria-label={`Действия со счётом ${account.name}`}>
              <MoreHorizontal size={19} aria-hidden="true" />
            </summary>
            <div className="account-card__menu-items">
              <>
                {!account.isDefault && !account.isArchived && (
                  <button
                    type="button"
                    disabled={isUpdatingDefault}
                    onClick={() => onSetDefault(account)}
                  >
                    <Star size={15} aria-hidden="true" />
                    Сделать основным
                  </button>
                )}
                <button type="button" onClick={() => onEdit(account)}>
                  <Pencil size={15} aria-hidden="true" />
                  Редактировать
                </button>
                <button
                  type="button"
                  className={
                    account.isArchived ? undefined : "account-card__menu-delete"
                  }
                  disabled={isArchiving}
                  onClick={() => {
                    if (account.isArchived) {
                      onArchiveToggle(account);
                    } else {
                      menuRef.current?.removeAttribute("open");
                      setIsConfirmingArchive(true);
                    }
                  }}
                >
                  {account.isArchived ? (
                    <ArchiveRestore size={15} aria-hidden="true" />
                  ) : (
                    <Trash2 size={15} aria-hidden="true" />
                  )}
                  {account.isArchived ? "Восстановить из архива" : "Удалить"}
                </button>
              </>
            </div>
          </details>
        </div>
      </div>

      <p className="account-card__type">{ACCOUNT_TYPE_LABELS[account.type]}</p>
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__bank">
        {account.bankName || "Счёт без привязки к банку"}
      </p>

      <div className="account-card__balance">
        <span>Баланс</span>
        <strong
          className={Number(account.initialBalance) < 0 ? "is-negative" : ""}
        >
          {formatAccountAmount(account.initialBalance, account.currencyCode)}
        </strong>
      </div>

      {isConfirmingArchive &&
        createPortal(
          <motion.div
            className="account-archive-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsConfirmingArchive(false);
              }
            }}
          >
            <motion.section
              className="account-archive-dialog account-panel"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="account-archive-dialog-title"
              aria-describedby="account-archive-dialog-description"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <span className="account-archive-dialog__icon" aria-hidden="true">
                <Archive size={20} />
              </span>
              <h2 id="account-archive-dialog-title">Удалить счет?</h2>
              <p id="account-archive-dialog-description">
                Счёт «{account.name}» исчезнет из списка. Его данные сохранятся
                в архиве.
              </p>
              <div className="account-archive-dialog__actions">
                <button
                  ref={cancelButtonRef}
                  type="button"
                  disabled={isArchiving}
                  onClick={() => setIsConfirmingArchive(false)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="account-archive-dialog__confirm"
                  disabled={isArchiving}
                  onClick={() => {
                    setIsConfirmingArchive(false);
                    onArchiveToggle(account);
                  }}
                >
                  {isArchiving ? "Удаление…" : "Удалить"}
                </button>
              </div>
            </motion.section>
          </motion.div>,
          document.body,
        )}
    </motion.article>
  );
};
