import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";
import "./LoadingState.css";

interface LoadingStateProps {
  type:
    | "card"
    | "list"
    | "detail"
    | "table"
    | "profile"
    | "article"
    | "form"
    | "gallery"
    | "grid";
  count?: number;
  className?: string;
  withImage?: boolean;
  withActions?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  count = 1,
  className = "",
  withImage = true,
  withActions = false,
}) => {
  // Card loading state
  const renderCardLoading = () => (
    <div className={`loading-card ${className}`}>
      {withImage && <LoadingSkeleton type="image" height="150px" />}
      <div className="loading-card-content">
        <LoadingSkeleton type="title" width="80%" />
        <LoadingSkeleton type="text" width="50%" />
        <LoadingSkeleton type="paragraph" count={2} />
        {withActions && (
          <div className="loading-card-actions">
            <LoadingSkeleton type="button" width="80px" />
            <LoadingSkeleton type="button" width="80px" />
          </div>
        )}
      </div>
    </div>
  );

  // List loading state
  const renderListLoading = () => (
    <div className={`loading-list ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="loading-list-item">
            {withImage && <LoadingSkeleton type="avatar" />}
            <div className="loading-list-content">
              <LoadingSkeleton type="title" width="60%" />
              <LoadingSkeleton type="text" width="80%" />
            </div>
            {withActions && (
              <div className="loading-list-actions">
                <LoadingSkeleton type="button" width="40px" height="40px" />
              </div>
            )}
          </div>
        ))}
    </div>
  );

  // Detail loading state (like the news detail page)
  const renderDetailLoading = () => (
    <div className={`loading-detail ${className}`}>
      <div className="loading-detail-header">
        <LoadingSkeleton type="button" width="120px" height="36px" />
        <div className="loading-detail-meta">
          <LoadingSkeleton type="text" width="120px" height="30px" />
          <LoadingSkeleton type="text" width="120px" height="30px" />
          <LoadingSkeleton type="text" width="120px" height="30px" />
        </div>
      </div>

      <div className="loading-detail-content">
        {withImage && (
          <div className="loading-detail-image">
            <LoadingSkeleton type="image" height="400px" />
          </div>
        )}

        <div className="loading-detail-info">
          <LoadingSkeleton type="title" width="80%" height="40px" />
          <LoadingSkeleton type="text" width="100%" height="20px" />

          <div className="loading-detail-tags">
            <LoadingSkeleton type="tag" />
            <LoadingSkeleton type="tag" />
            <LoadingSkeleton type="tag" />
          </div>

          {withActions && (
            <div className="loading-detail-actions">
              <LoadingSkeleton type="button" width="100px" height="40px" />
              <LoadingSkeleton type="button" width="100px" height="40px" />
            </div>
          )}

          <div className="loading-detail-body">
            <LoadingSkeleton type="paragraph" count={5} fullWidth />
          </div>
        </div>
      </div>
    </div>
  );

  // Table loading state
  const renderTableLoading = () => (
    <div className={`loading-table ${className}`}>
      <div className="loading-table-header">
        <LoadingSkeleton type="text" width="15%" height="30px" />
        <LoadingSkeleton type="text" width="25%" height="30px" />
        <LoadingSkeleton type="text" width="35%" height="30px" />
        <LoadingSkeleton type="text" width="15%" height="30px" />
        {withActions && (
          <LoadingSkeleton type="text" width="10%" height="30px" />
        )}
      </div>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="loading-table-row">
            <LoadingSkeleton type="text" width="15%" height="20px" />
            <LoadingSkeleton type="text" width="25%" height="20px" />
            <LoadingSkeleton type="text" width="35%" height="20px" />
            <LoadingSkeleton type="text" width="15%" height="20px" />
            {withActions && (
              <LoadingSkeleton type="button" width="10%" height="20px" />
            )}
          </div>
        ))}
    </div>
  );

  // Profile loading state
  const renderProfileLoading = () => (
    <div className={`loading-profile ${className}`}>
      <div className="loading-profile-header">
        <LoadingSkeleton type="circle" width="100px" height="100px" />
        <div className="loading-profile-info">
          <LoadingSkeleton type="title" width="60%" />
          <LoadingSkeleton type="text" width="40%" />
          <div className="loading-profile-tags">
            <LoadingSkeleton type="tag" />
            <LoadingSkeleton type="tag" />
          </div>
        </div>
      </div>
      <div className="loading-profile-content">
        <LoadingSkeleton type="paragraph" count={4} fullWidth />
      </div>
      {withActions && (
        <div className="loading-profile-actions">
          <LoadingSkeleton type="button" width="120px" />
          <LoadingSkeleton type="button" width="120px" />
        </div>
      )}
    </div>
  );

  // Gallery loading state
  const renderGalleryLoading = () => (
    <div className={`loading-gallery ${className}`}>
      <div className="loading-gallery-grid">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="loading-gallery-item">
              <LoadingSkeleton
                type="image"
                height={index % 3 === 0 ? "300px" : "200px"}
              />
              <div className="loading-gallery-caption">
                <LoadingSkeleton type="text" width="80%" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Grid loading state
  const renderGridLoading = () => (
    <div className={`loading-grid ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="loading-grid-item">
            {withImage && <LoadingSkeleton type="image" height="180px" />}
            <div className="loading-grid-content">
              <LoadingSkeleton type="title" width="80%" />
              <LoadingSkeleton type="text" width="60%" />
              {withActions && <LoadingSkeleton type="button" width="100px" />}
            </div>
          </div>
        ))}
    </div>
  );

  // Article loading state
  const renderArticleLoading = () => (
    <div className={`loading-article ${className}`}>
      <LoadingSkeleton type="title" width="80%" height="40px" />
      <div className="loading-article-meta">
        <LoadingSkeleton type="text" width="100px" />
        <LoadingSkeleton type="text" width="150px" />
      </div>
      {withImage && <LoadingSkeleton type="image" height="350px" />}
      <div className="loading-article-content">
        <LoadingSkeleton type="paragraph" count={7} fullWidth />
      </div>
    </div>
  );

  // Form loading state
  const renderFormLoading = () => (
    <div className={`loading-form ${className}`}>
      <LoadingSkeleton type="title" width="60%" />
      <div className="loading-form-group">
        <LoadingSkeleton type="text" width="30%" height="20px" />
        <LoadingSkeleton type="text" width="100%" height="40px" />
      </div>
      <div className="loading-form-group">
        <LoadingSkeleton type="text" width="30%" height="20px" />
        <LoadingSkeleton type="text" width="100%" height="40px" />
      </div>
      <div className="loading-form-group">
        <LoadingSkeleton type="text" width="30%" height="20px" />
        <LoadingSkeleton type="paragraph" count={3} height="40px" />
      </div>
      {withActions && (
        <div className="loading-form-actions">
          <LoadingSkeleton type="button" width="120px" height="45px" />
        </div>
      )}
    </div>
  );

  // Render the appropriate loading state based on type
  const renderLoading = () => {
    switch (type) {
      case "card":
        return Array(count)
          .fill(0)
          .map((_, index) => (
            <React.Fragment key={index}>{renderCardLoading()}</React.Fragment>
          ));
      case "list":
        return renderListLoading();
      case "detail":
        return renderDetailLoading();
      case "table":
        return renderTableLoading();
      case "profile":
        return renderProfileLoading();
      case "article":
        return renderArticleLoading();
      case "form":
        return renderFormLoading();
      case "gallery":
        return renderGalleryLoading();
      case "grid":
        return renderGridLoading();
      default:
        return renderCardLoading();
    }
  };

  return <>{renderLoading()}</>;
};

export default LoadingState;
