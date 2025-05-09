import React from 'react';

const AdminDashboardContents: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-8">
            <h1 className="text-xl font-bold">Welcome, Admin!</h1>
            <p className="text-muted-foreground">
                Manage your teachers and students.
            </p>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 1</div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 2</div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 3</div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center"></div>
        </div>
    );
};

export default AdminDashboardContents;