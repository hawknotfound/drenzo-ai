import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const handleUpgrade = (tier: string) => {
    onShowToast('Upgrade Initiated', `Upgraded to ${tier} plan (${billingCycle}). Welcome to Zyricon Pro!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-[#130E20] border border-[#31254A] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 text-white animate-in zoom-in-95 duration-150 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#241A3B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upgrade to Zyricon Pro</h3>
              <p className="text-xs text-[#8E84A5]">Supercharge your intelligence workflows with premium compute</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center my-5">
          <div className="inline-flex p-1 rounded-full bg-[#1A132B] border border-[#2B2042]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-[#2F214B] text-white shadow' : 'text-[#8E85A3] hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                billingCycle === 'annual' ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-[#8E85A3] hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950/80 text-purple-200 border border-purple-400/40">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          {/* Pro Plan */}
          <div className="rounded-2xl bg-gradient-to-b from-[#1C142E] to-[#140E23] border-2 border-[#8B5CF6]/80 p-5 relative shadow-[0_0_25px_rgba(139,92,246,0.15)] flex flex-col justify-between">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[10px] font-semibold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                Zyricon Pro
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '$18' : '$24'}
                </span>
                <span className="text-xs text-[#8E85A3]">/ month</span>
              </div>
              <p className="text-xs text-[#9D93B3] mb-4">
                Unlimited access to GPT-4o, Claude 3.5 Sonnet, and high-res image generation.
              </p>

              <div className="space-y-2 text-xs text-[#CDC4E0]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unlimited Fast Reasoning & GPT-4o</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>4K Image Studio & Upscaling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unlimited Slide Decks & Exporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Web Browsing & Code Interpreter</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('Zyricon Pro')}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </button>
          </div>

          {/* Enterprise / Team Plan */}
          <div className="rounded-2xl bg-[#171126] border border-[#2B2042] p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#8E84A5] uppercase tracking-wider mb-1">
                Enterprise Studio
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '$48' : '$59'}
                </span>
                <span className="text-xs text-[#8E85A3]">/ user / mo</span>
              </div>
              <p className="text-xs text-[#9D93B3] mb-4">
                Dedicated compute clusters, custom fine-tuned personas, and team workspaces.
              </p>

              <div className="space-y-2 text-xs text-[#CDC4E0]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Everything in Pro Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Collaborative Multi-user Workspaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Zero-retention Data Privacy SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dedicated API Keys & SSO</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('Enterprise Studio')}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#231A38] hover:bg-[#2F234C] text-white font-semibold text-xs border border-purple-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-purple-300" />
              <span>Contact Enterprise</span>
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="text-center text-[11px] text-[#786E8C] pt-3">
          Instant activation • Cancel anytime • 14-day money back guarantee
        </div>
      </div>
    </div>
  );
};
