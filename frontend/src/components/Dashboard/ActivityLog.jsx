import React from "react";


function ActivityLog({ activities, statusColors }) {
  return (
    <div className="activity-log">
      <div className="activity-header">Recent Activities</div>
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className="activity-content">
            <span className="activity-user">{activity.user}</span>
            <span>{activity.action}</span>
            <span className={`badge ${statusColors[activity.status]?.badge}`}>
              {activity.status}
            </span>
          </div>
          <div className="activity-time">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}

export default ActivityLog;

