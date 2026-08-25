import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

import "../../styles/student-wallet.css";


function StudentWallet() {

    const navigate = useNavigate();

    const [wallet, setWallet] = useState({
        balance: "0.00",
        transactions: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchWallet = async () => {

            try {

                const response = await api.get(
                    "/courses/wallet/transactions/"
                );

                console.log(
                    "WALLET:",
                    response.data
                );

                setWallet(response.data);

            } catch (error) {

                console.error(
                    "Wallet error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load your wallet."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchWallet();

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );

    };


    const getTransactionLabel = (type) => {

        switch (type) {

            case "DEPOSIT":
                return "Deposit";

            case "COURSE_PURCHASE":
                return "Course Purchase";

            case "REFUND":
                return "Refund";

            default:
                return type;

        }

    };


    const getTransactionIcon = (type) => {

        switch (type) {

            case "DEPOSIT":
                return "↓";

            case "COURSE_PURCHASE":
                return "→";

            case "REFUND":
                return "↩";

            default:
                return "•";

        }

    };


    const isPositive = (type) => {

        return (
            type === "DEPOSIT" ||
            type === "REFUND"
        );

    };


    if (loading) {

        return (
            <StudentLayout>

                <div className="wallet-loading">
                    Loading wallet...
                </div>

            </StudentLayout>
        );

    }


    if (error) {

        return (
            <StudentLayout>

                <div className="wallet-page">

                    <div className="wallet-error">

                        <h2>
                            Unable to Load Wallet
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/dashboard")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                    </div>

                </div>

            </StudentLayout>
        );

    }


    return (
        <StudentLayout>

            <div className="wallet-page">

                {/* Header */}

                <div className="wallet-header">

                    <div>

                        <span>
                            FINANCIAL
                        </span>

                        <h1>
                            My Wallet
                        </h1>

                        <p>
                            Manage your balance and view your
                            transaction history.
                        </p>

                    </div>

                    <button
                        className="wallet-back"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* Balance */}

                <section className="wallet-balance-card">

                    <div className="wallet-balance-content">

                        <span>
                            CURRENT BALANCE
                        </span>

                        <strong>
                            {wallet.balance}
                        </strong>

                        <small>
                            EGP
                        </small>

                    </div>


                    <div className="wallet-balance-icon">
                        $
                    </div>

                </section>


                {/* Stats */}

                <div className="wallet-stats">

                    <div className="wallet-stat-card">

                        <span>
                            TRANSACTIONS
                        </span>

                        <strong>
                            {wallet.transactions.length}
                        </strong>

                    </div>


                    <div className="wallet-stat-card">

                        <span>
                            WALLET STATUS
                        </span>

                        <strong>
                            Active
                        </strong>

                    </div>

                </div>


                {/* Transactions */}

                <section className="wallet-transactions">

                    <div className="wallet-section-header">

                        <div>

                            <span>
                                ACTIVITY
                            </span>

                            <h2>
                                Transaction History
                            </h2>

                        </div>

                    </div>


                    {!wallet.transactions.length ? (

                        <div className="wallet-empty">

                            <div className="wallet-empty-icon">
                                $
                            </div>

                            <h3>
                                No transactions yet
                            </h3>

                            <p>
                                Your wallet activity will appear
                                here.
                            </p>

                        </div>

                    ) : (

                        <div className="transactions-list">

                            {wallet.transactions.map(
                                (transaction) => {

                                    const positive =
                                        isPositive(
                                            transaction.type
                                        );

                                    return (

                                        <div
                                            className="transaction-card"
                                            key={transaction.id}
                                        >

                                            <div
                                                className={`transaction-icon ${positive
                                                        ? "positive"
                                                        : "negative"
                                                    }`}
                                            >
                                                {getTransactionIcon(
                                                    transaction.type
                                                )}
                                            </div>


                                            <div className="transaction-info">

                                                <h3>
                                                    {getTransactionLabel(
                                                        transaction.type
                                                    )}
                                                </h3>

                                                <p>
                                                    {
                                                        transaction.description ||
                                                        transaction.course ||
                                                        "Wallet transaction"
                                                    }
                                                </p>

                                                {transaction.course && (
                                                    <span>
                                                        Course:{" "}
                                                        {
                                                            transaction.course
                                                        }
                                                    </span>
                                                )}

                                            </div>


                                            <div className="transaction-meta">

                                                <strong
                                                    className={
                                                        positive
                                                            ? "amount-positive"
                                                            : "amount-negative"
                                                    }
                                                >
                                                    {positive
                                                        ? "+"
                                                        : "-"}
                                                    {transaction.amount}
                                                    {" "}
                                                    EGP
                                                </strong>

                                                <span>
                                                    {formatDate(
                                                        transaction.created_at
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>

            </div>

        </StudentLayout>
    );
}


export default StudentWallet;