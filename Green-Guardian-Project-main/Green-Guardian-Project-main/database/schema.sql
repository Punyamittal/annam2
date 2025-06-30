-- Appwrite Database Schema for GreenGuardian

-- Create database
CREATE DATABASE greenguardian;

-- Regions Collection
-- Stores environmental data for specific geographical regions
CREATE COLLECTION regions (
    -- Basic information
    id STRING PRIMARY KEY,
    name STRING REQUIRED,
    lat DOUBLE REQUIRED,
    lon DOUBLE REQUIRED,
    
    -- Environmental data
    air_quality OBJECT REQUIRED,
    water_quality OBJECT,
    uv_index DOUBLE REQUIRED,
    pollen_count OBJECT,
    weather OBJECT REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    sources ARRAY,
    data_confidence STRING REQUIRED,
    
    -- Indexes
    INDEX idx_region_location (lat, lon),
    INDEX idx_region_name (name),
    INDEX idx_region_timestamp (timestamp)
);

-- User Preferences Collection
-- Stores user preferences and settings
CREATE COLLECTION user_preferences (
    -- Basic information
    id STRING PRIMARY KEY,
    user_id STRING REQUIRED UNIQUE,
    
    -- Preferences
    default_location STRING,
    health_conditions ARRAY,
    notification_preferences OBJECT,
    risk_thresholds OBJECT,
    
    -- Metadata
    created_at DATETIME REQUIRED,
    updated_at DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_user_id (user_id)
);

-- Risk Assessments Collection
-- Stores risk assessments for regions
CREATE COLLECTION risk_assessments (
    -- Basic information
    id STRING PRIMARY KEY,
    region_id STRING REQUIRED,
    
    -- Risk data
    overall_risk OBJECT REQUIRED,
    specific_risks ARRAY REQUIRED,
    trend OBJECT REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_risk_region_id (region_id),
    INDEX idx_risk_timestamp (timestamp)
);

-- Advice Collection
-- Stores environmental advice for regions
CREATE COLLECTION advice (
    -- Basic information
    id STRING PRIMARY KEY,
    region_id STRING REQUIRED,
    
    -- Advice data
    general_advice STRING REQUIRED,
    specific_recommendations ARRAY REQUIRED,
    preventive_measures ARRAY REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_advice_region_id (region_id),
    INDEX idx_advice_timestamp (timestamp)
);

-- User Queries Collection
-- Stores user queries and interactions
CREATE COLLECTION user_queries (
    -- Basic information
    id STRING PRIMARY KEY,
    user_id STRING REQUIRED,
    
    -- Query data
    query STRING REQUIRED,
    location STRING,
    response STRING REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_query_user_id (user_id),
    INDEX idx_query_timestamp (timestamp)
);

-- Logs Collection
-- Stores system logs and events
CREATE COLLECTION logs (
    -- Basic information
    id STRING PRIMARY KEY,
    event_type STRING REQUIRED,
    
    -- Log data
    data OBJECT REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_log_event_type (event_type),
    INDEX idx_log_timestamp (timestamp)
);

-- Historical Data Collection
-- Stores historical environmental data
CREATE COLLECTION historical_data (
    -- Basic information
    id STRING PRIMARY KEY,
    region_id STRING REQUIRED,
    
    -- Data
    data_type STRING REQUIRED,
    data OBJECT REQUIRED,
    
    -- Metadata
    timestamp DATETIME REQUIRED,
    
    -- Indexes
    INDEX idx_historical_region_id (region_id),
    INDEX idx_historical_data_type (data_type),
    INDEX idx_historical_timestamp (timestamp)
);
