import React from 'react';

const SkeletonCard = () => (
    <div className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            </div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
    </div>
);

const DashboardSkeleton = ({ theme }) => {
    const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
    const pulseColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const pulseText = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        <>
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                <div>
                    <div className={`h-10 ${pulseText} rounded w-48 animate-pulse`}></div>
                    <div className={`h-6 ${pulseColor} rounded w-64 mt-2 animate-pulse`}></div>
                </div>
                <div className={`p-1.5 rounded-xl inline-flex ${pulseColor} animate-pulse`}>
                    <div className={`h-11 w-64 rounded-lg ${pulseText}`}></div>
                </div>
            </div>

            <div className={`h-px w-full mb-8 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}></div>

            {/* Dashboard Cards Skeleton */}
            <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>

            {/* Analytics & Form Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column Skeleton */}
                <div className="xl:col-span-7 space-y-8">
                    <div className={`h-8 ${pulseText} rounded w-1/3 mb-5 animate-pulse`}></div>
                    <div className={`${bgColor} shadow-lg rounded-2xl p-6 animate-pulse h-96`}></div>
                    <div className={`${bgColor} shadow-lg rounded-2xl p-6 animate-pulse h-40`}></div>
                </div>

                {/* Right Column Skeleton */}
                <div className="xl:col-span-5">
                    <div className={`h-8 ${pulseText} rounded w-1/2 mb-5 animate-pulse`}></div>
                    <div className={`${bgColor} shadow-lg rounded-2xl p-6 animate-pulse h-[500px]`}></div>
                </div>
            </div>

            {/* Transactions Table Skeleton */}
            <div className="mt-8">
                <div className={`h-8 ${pulseText} rounded w-1/4 mb-5 animate-pulse`}></div>
                <div className={`${bgColor} shadow-lg rounded-2xl p-6 animate-pulse`}>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-12 ${pulseColor} rounded`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardSkeleton;