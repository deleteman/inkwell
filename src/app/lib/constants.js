
export const DEFAULT_ROLE = 'free'
export const PRO_ROLE = 'pro'
export const LIMITED_PRO_ROLE = 'limited_pro'
export const MAX_LIMITED_PRO_REVIEWS = 5;

const LFG_MONTHLY = process.env.STRIPE_PRICE_LFG_MONTHLY_ID
const LFG_YEARLY = process.env.STRIPE_PRICE_LFG_YEARLY_ID
const IMA_PRO = process.env.STRIPE_PRICE_PRO_ID
const LIMITED_PRO = process.env.STRIPE_PRICE_LIMITED_PRO_ID

export const PRICING_TABLE = {
  limited_pro: LIMITED_PRO,
  lfg_monthly: LFG_MONTHLY,
  lfg_yearly: LFG_YEARLY,
  imapro: IMA_PRO,
}
export const PRICE_ID_TO_ROLE = {
    [LFG_MONTHLY]: PRO_ROLE,          // LFG
    [LFG_YEARLY]: PRO_ROLE,          // LFG
    [IMA_PRO]: PRO_ROLE,          // I'm a PRO
    [LIMITED_PRO]: LIMITED_PRO_ROLE, // I'm testing it
  }

console.log("the pricing table: ")
console.log(PRICE_ID_TO_ROLE )

export const STRIPE_CUSTOMER_PORTAL_URL = "https://billing.stripe.com/p/login/test_cN23eN7i6cjH7ccdQQ"

export const WEBSITE_TITLE="InkWellAI: Your AI Editing Assistant for Technical Articles"
export const WEBSITE_DESCRIPTION=""
export const WEBSITE_URL="https://www.inkwellai.net"