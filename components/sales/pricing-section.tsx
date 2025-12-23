import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingPlan {
    id: string
    title: string
    price: number // in cents
    currency: string
    features: string[]
    isPopular: boolean
}

interface PricingSectionProps {
    plans: PricingPlan[]
}

function formatPrice(cents: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(cents / 100)
}

export function PricingSection({ plans }: PricingSectionProps) {
    return (
        <section className="py-24 bg-zinc-950 relative">
            {/* Background accent */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/15 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Path</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Invest in your musical journey today</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-8 transition-all ${plan.isPopular
                                    ? "bg-zinc-900 border-2 border-[#7c3aed] glow-purple"
                                    : "bg-zinc-900/80 border border-border/50"
                                }`}
                        >
                            {/* Best Value Badge */}
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#7c3aed] text-white text-sm font-medium">
                                        <Sparkles className="w-4 h-4" />
                                        Best Value
                                    </div>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-8 pt-2">
                                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {plan.isPopular ? "Best value for serious learners" : "Perfect for trying out the course"}
                                </p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span
                                        className={`text-5xl font-bold ${plan.isPopular ? "text-daw-purple glow-text-purple" : "text-foreground"}`}
                                    >
                                        {formatPrice(plan.price, plan.currency)}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {plan.isPopular ? "one-time" : "/month"}
                                    </span>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-4 mb-8">
                                {(plan.features as string[]).map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.isPopular ? "bg-daw-purple/20" : "bg-secondary"
                                                }`}
                                        >
                                            <Check className={`w-3 h-3 ${plan.isPopular ? "text-daw-purple" : "text-daw-cyan"}`} />
                                        </div>
                                        <span className="text-sm text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                className={`w-full py-6 text-lg font-semibold transition-all ${plan.isPopular
                                        ? "bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white hover:scale-[1.02]"
                                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                                    }`}
                            >
                                {plan.isPopular ? "Get Lifetime Access" : "Start Monthly"}
                            </Button>

                            {/* Decorative corners for featured */}
                            {plan.isPopular && (
                                <>
                                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-daw-purple/40" />
                                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-daw-purple/40" />
                                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-daw-cyan/40" />
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-daw-cyan/40" />
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Money-back guarantee */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    30-day money-back guarantee. No questions asked.
                </p>
            </div>
        </section>
    )
}
