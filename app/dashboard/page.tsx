import React from "react";
import DashbaordHeader from "./_components/DashbaordHeader";
import UserStoryList from "./_components/UserStoryList";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="p-10 md:px-20 lg:px-40 mt-5">
        <DashbaordHeader />

        <UserStoryList />
      </div>
    </div>
  );
}

export default Dashboard;
