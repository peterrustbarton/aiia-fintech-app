"use client";

import React, { useState } from "react";

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    symbol: string;
    companyName?: string;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, symbol, companyName }) => {
    const [action, setAction] = useState<"Buy" | "Sell">("Buy");
    const [inputMode, setInputMode] = useState<"quantity" | "amount">("quantity");
    const [quantity, setQuantity] = useState(0);
    const [dollarAmount, setDollarAmount] = useState(0);
    const [orderType, setOrderType] = useState("Market");
    const [price, setPrice] = useState<number | "">("");
    const [timeInForce, setTimeInForce] = useState("Day");

    if (!isOpen) return null;

    // Temporary placeholder stock price
    const stockPrice = 170.42;
    let estimatedValue = "--";
    if (inputMode === "quantity" && quantity > 0) {
        estimatedValue = `$${(quantity * stockPrice).toFixed(2)}`;
    } else if (inputMode === "amount" && dollarAmount > 0) {
        estimatedValue = `$${dollarAmount.toFixed(2)}`;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="panel w-full max-w-lg animate-slide-down">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-theme-panel-border pb-2 mb-3">
                    <h2 className="text-lg font-semibold text-accent-blue">Trade</h2>
                    <button onClick={onClose} className="btn-ghost px-2 py-1">X</button>
                </div>

                {/* Account Info */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Account:</span>
                        <span className="text-gray-400">Brokerage (123456)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Cash available to trade</span>
                        <span className="text-teal-400 font-semibold">$72.67</span>
                    </div>
                </div>

                {/* Symbol */}
                <div className="mb-4">
                    <p className="text-base font-bold">{symbol} - {companyName}</p>
                    <p className="text-green-400 text-xs">Bid: $170.42 | Ask: $170.43 | Vol: 36.8M</p>
                </div>

                {/* Action (Buy/Sell) */}
                <div className="mb-4">
                    <label className="block text-xs mb-1">Action</label>
                    <div className="flex space-x-2">
                        <button onClick={() => setAction("Buy")} className={`flex-1 py-2 rounded-md ${action === "Buy" ? "btn-primary-gradient" : "btn-ghost"}`}>Buy</button>
                        <button onClick={() => setAction("Sell")} className={`flex-1 py-2 rounded-md ${action === "Sell" ? "btn-primary-gradient" : "btn-ghost"}`}>Sell</button>
                    </div>
                </div>

                {/* Input Mode Toggle */}
                <div className="mb-4">
                    <label className="block text-xs mb-1">Input Mode</label>
                    <div className="flex space-x-2">
                        <button onClick={() => setInputMode("quantity")} className={`flex-1 py-2 rounded-md ${inputMode === "quantity" ? "btn-primary-gradient" : "btn-ghost"}`}>Quantity</button>
                        <button onClick={() => setInputMode("amount")} className={`flex-1 py-2 rounded-md ${inputMode === "amount" ? "btn-primary-gradient" : "btn-ghost"}`}>Dollar Amount</button>
                    </div>
                </div>

                {/* Quantity / Dollar Amount input */}
                {inputMode === "quantity" ? (
                    <div className="mb-4">
                        <label className="block text-xs mb-1">Quantity</label>
                        <input
                            type="number"
                            min={0}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-theme-panel-bg border border-theme-panel-border focus:ring-2 focus:ring-theme-accent"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="block text-xs mb-1">Dollar Amount</label>
                        <input
                            type="number"
                            min={0}
                            value={dollarAmount}
                            onChange={(e) => setDollarAmount(Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-theme-panel-bg border border-theme-panel-border focus:ring-2 focus:ring-theme-accent"
                        />
                    </div>
                )}

                {/* Order Type */}
                <div className="mb-4">
                    <label className="block text-xs mb-1">Order Type</label>
                    <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="w-full p-2 rounded-md bg-theme-panel-bg border border-theme-panel-border focus:ring-2 focus:ring-theme-accent"
                    >
                        <option>Market</option>
                        <option>Limit</option>
                        <option>Stop</option>
                        <option>Stop Limit</option>
                        <option>Trailing Stop</option>
                        <option>Trailing Stop Limit</option>
                    </select>
                </div>

                {/* Price (shown only for Limit/Stop types) */}
                {["Limit", "Stop", "Stop Limit"].includes(orderType) && (
                    <div className="mb-4">
                        <label className="block text-xs mb-1">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-theme-panel-bg border border-theme-panel-border focus:ring-2 focus:ring-theme-accent"
                        />
                    </div>
                )}

                {/* Time in Force */}
                <div className="mb-6">
                    <label className="block text-xs mb-1">Time in Force</label>
                    <select
                        value={timeInForce}
                        onChange={(e) => setTimeInForce(e.target.value)}
                        className="w-full p-2 rounded-md bg-theme-panel-bg border border-theme-panel-border focus:ring-2 focus:ring-theme-accent"
                    >
                        <option>Day</option>
                        <option>GTC</option>
                    </select>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-theme-panel-border pt-3">
                    <div>
                        <p className="text-xs text-text-secondary">Estimated Value</p>
                        <p className="font-semibold">{estimatedValue}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={onClose} className="btn-ghost">Cancel</button>
                        <button className="btn-primary-gradient">Place Order</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TradeModal;