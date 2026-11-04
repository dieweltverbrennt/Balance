export type AccountType = 'cash' | 'debit' | 'credit' | 'savings'

export interface Account {
  id: string
  name: string
  bankName: string | null
  type: AccountType
  currencyCode: string
  initialBalance: string
  isArchived: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAccountData {
  name: string
  bankName?: string | null
  type: AccountType
  currencyCode: string
  initialBalance?: string
  isArchived?: boolean
  isDefault?: boolean
}

export type UpdateAccountData = Partial<CreateAccountData>

export interface DeleteAccountResponse {
  message: string
}
