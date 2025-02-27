import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    image: Attribute.String;
    gender: Attribute.Enumeration<['male', 'female', 'other']>;
    fullName: Attribute.String;
    dob: Attribute.Date;
    profession: Attribute.String;
    googleId: Attribute.String;
    facebookId: Attribute.String;
    subscriptions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::subscription.subscription'
    >;
    capsuleplus: Attribute.Boolean & Attribute.DefaultTo<false>;
    socketId: Attribute.String;
    newslettersSubscribed: Attribute.Boolean & Attribute.DefaultTo<false>;
    isTermAndConditionAccept: Attribute.Boolean & Attribute.DefaultTo<false>;
    profileStatus: Attribute.Enumeration<['pending', 'complete']>;
    summit_payments: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::summit-payment.summit-payment'
    >;
    password: Attribute.Password;
    username: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAboutUsAboutUs extends Schema.SingleType {
  collectionName: 'about_uses';
  info: {
    singularName: 'about-us';
    pluralName: 'about-uses';
    displayName: 'About Us';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    description: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::about-us.about-us',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::about-us.about-us',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBucketBucket extends Schema.CollectionType {
  collectionName: 'buckets';
  info: {
    singularName: 'bucket';
    pluralName: 'buckets';
    displayName: 'Bucket';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::bucket.bucket', 'name'> & Attribute.Required;
    image: Attribute.Media;
    capsuleplus: Attribute.Boolean & Attribute.DefaultTo<false>;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    description: Attribute.Text;
    category: Attribute.Relation<
      'api::bucket.bucket',
      'manyToOne',
      'api::category.category'
    >;
    tag: Attribute.Relation<'api::bucket.bucket', 'manyToOne', 'api::tag.tag'>;
    companies: Attribute.Relation<
      'api::bucket.bucket',
      'manyToMany',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::bucket.bucket',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::bucket.bucket',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBusinessSegmentBusinessSegment
  extends Schema.CollectionType {
  collectionName: 'business_segments';
  info: {
    singularName: 'business-segment';
    pluralName: 'business-segments';
    displayName: 'businessSegment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    image: Attribute.Media;
    company: Attribute.Relation<
      'api::business-segment.business-segment',
      'manyToOne',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::business-segment.business-segment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::business-segment.business-segment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCapsuleplusCapsuleplus extends Schema.SingleType {
  collectionName: 'capsulepluses';
  info: {
    singularName: 'capsuleplus';
    pluralName: 'capsulepluses';
    displayName: 'Capsuleplus';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::capsuleplus.capsuleplus',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::capsuleplus.capsuleplus',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    singularName: 'category';
    pluralName: 'categories';
    displayName: 'Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::category.category', 'name'>;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    buckets: Attribute.Relation<
      'api::category.category',
      'oneToMany',
      'api::bucket.bucket'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanyCompany extends Schema.CollectionType {
  collectionName: 'companies';
  info: {
    singularName: 'company';
    pluralName: 'companies';
    displayName: 'Company';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    about: Attribute.Text;
    sector: Attribute.Relation<
      'api::company.company',
      'manyToOne',
      'api::sector.sector'
    >;
    industry: Attribute.Relation<
      'api::company.company',
      'manyToOne',
      'api::industry.industry'
    >;
    company_type: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'api::company-type.company-type'
    >;
    featuredImage: Attribute.Media;
    logo: Attribute.Media;
    title: Attribute.String;
    productDetail: Attribute.Text;
    websiteUrl: Attribute.String;
    buckets: Attribute.Relation<
      'api::company.company',
      'manyToMany',
      'api::bucket.bucket'
    >;
    slug: Attribute.UID<'api::company.company', 'name'> & Attribute.Required;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    business_segments: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::business-segment.business-segment'
    >;
    keyHighlights: Attribute.Blocks;
    company_share_detail: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'api::company-share-detail.company-share-detail'
    >;
    capsuleView: Attribute.Blocks;
    aboutTheCompany: Attribute.Blocks;
    businessDetail: Attribute.Blocks;
    businessOverview: Attribute.Blocks;
    compnay_timelines: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::compnay-timeline.compnay-timeline'
    >;
    financial_highlights: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::financial-highlight.financial-highlight'
    >;
    share_holdings: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::share-holding.share-holding'
    >;
    financialReport: Attribute.Blocks;
    shareCapitalAndEmployees: Attribute.Blocks;
    companyTypeDetails: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::company-type-detail.company-type-detail'
    >;
    operation_details: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::operation-detail.operation-detail'
    >;
    whatsNewInCapsulePlusImage: Attribute.Media;
    capsuleplus: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanyShareDetailCompanyShareDetail
  extends Schema.CollectionType {
  collectionName: 'company_share_details';
  info: {
    singularName: 'company-share-detail';
    pluralName: 'company-share-details';
    displayName: 'companyShareDetail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    peRatio: Attribute.Float;
    rocePercent: Attribute.Float;
    roicPercent: Attribute.Float;
    roePercent: Attribute.Float;
    currentPrice: Attribute.Float;
    deRatio: Attribute.Float;
    cwip: Attribute.String;
    cashConversionCycle: Attribute.String;
    pegRatio: Attribute.Float;
    ltp: Attribute.Float;
    prevClosePrice: Attribute.Float;
    changeInPercent: Attribute.Float;
    dayHigh: Attribute.Float;
    dayLow: Attribute.Float;
    sectoralPERange: Attribute.String;
    BSE: Attribute.Integer;
    NSE: Attribute.Integer;
    peRemark: Attribute.String;
    company: Attribute.Relation<
      'api::company-share-detail.company-share-detail',
      'oneToOne',
      'api::company.company'
    >;
    marketCap: Attribute.Float;
    change: Attribute.Float;
    ttpmPE: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company-share-detail.company-share-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company-share-detail.company-share-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanySharePriceCompanySharePrice
  extends Schema.CollectionType {
  collectionName: 'company_share_prices';
  info: {
    singularName: 'company-share-price';
    pluralName: 'company-share-prices';
    displayName: 'companySharePrice';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    companyId: Attribute.Relation<
      'api::company-share-price.company-share-price',
      'oneToOne',
      'api::company.company'
    >;
    date: Attribute.Date;
    price: Attribute.Float & Attribute.Required;
    volume: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company-share-price.company-share-price',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company-share-price.company-share-price',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanyTypeCompanyType extends Schema.CollectionType {
  collectionName: 'company_types';
  info: {
    singularName: 'company-type';
    pluralName: 'company-types';
    displayName: 'CompanyType';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::company-type.company-type', 'name'> &
      Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company-type.company-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company-type.company-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanyTypeDetailCompanyTypeDetail
  extends Schema.CollectionType {
  collectionName: 'company_type_details';
  info: {
    singularName: 'company-type-detail';
    pluralName: 'company-type-details';
    displayName: 'CompanyTypeDetail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    value: Attribute.String;
    remark: Attribute.String;
    company: Attribute.Relation<
      'api::company-type-detail.company-type-detail',
      'manyToOne',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company-type-detail.company-type-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company-type-detail.company-type-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompnayTimelineCompnayTimeline
  extends Schema.CollectionType {
  collectionName: 'compnay_timelines';
  info: {
    singularName: 'compnay-timeline';
    pluralName: 'compnay-timelines';
    displayName: 'CompnayTimeline';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    date: Attribute.Date;
    description: Attribute.Text;
    company: Attribute.Relation<
      'api::compnay-timeline.compnay-timeline',
      'manyToOne',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::compnay-timeline.compnay-timeline',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::compnay-timeline.compnay-timeline',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactUsContactUs extends Schema.SingleType {
  collectionName: 'contact_uses';
  info: {
    singularName: 'contact-us';
    pluralName: 'contact-uses';
    displayName: 'Contact-us';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    description: Attribute.Blocks;
    email: Attribute.Email;
    phone: Attribute.String;
    address: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-us.contact-us',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact-us.contact-us',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDisclaimerDisclaimer extends Schema.SingleType {
  collectionName: 'disclaimers';
  info: {
    singularName: 'disclaimer';
    pluralName: 'disclaimers';
    displayName: 'Disclaimer';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::disclaimer.disclaimer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::disclaimer.disclaimer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFeedFeed extends Schema.CollectionType {
  collectionName: 'feeds';
  info: {
    singularName: 'feed';
    pluralName: 'feeds';
    displayName: 'Feed';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    tag: Attribute.Relation<'api::feed.feed', 'oneToOne', 'api::tag.tag'>;
    featuredImage: Attribute.Media & Attribute.Required;
    url: Attribute.String;
    industry: Attribute.Relation<
      'api::feed.feed',
      'oneToOne',
      'api::industry.industry'
    >;
    description: Attribute.Blocks;
    slug: Attribute.UID<'api::feed.feed', 'title'> & Attribute.Required;
    image: Attribute.Media;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::feed.feed', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::feed.feed', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiFinancialHighlightFinancialHighlight
  extends Schema.CollectionType {
  collectionName: 'financial_highlights';
  info: {
    singularName: 'financial-highlight';
    pluralName: 'financial-highlights';
    displayName: 'FinancialHighlight';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    company: Attribute.Relation<
      'api::financial-highlight.financial-highlight',
      'manyToOne',
      'api::company.company'
    >;
    year: Attribute.String;
    value: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::financial-highlight.financial-highlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::financial-highlight.financial-highlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Schema.SingleType {
  collectionName: 'homepages';
  info: {
    singularName: 'homepage';
    pluralName: 'homepages';
    displayName: 'homepage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiIndexIndex extends Schema.CollectionType {
  collectionName: 'indices';
  info: {
    singularName: 'index';
    pluralName: 'indices';
    displayName: 'Index';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    indexType: Attribute.Enumeration<['Sensex', 'Nifty']> & Attribute.Required;
    date: Attribute.Date & Attribute.Required;
    price: Attribute.Float & Attribute.Required;
    FIICash: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::index.index',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::index.index',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiIndustryIndustry extends Schema.CollectionType {
  collectionName: 'industries';
  info: {
    singularName: 'industry';
    pluralName: 'industries';
    displayName: 'Industry';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    industrialOutlook: Attribute.Blocks & Attribute.Required;
    slug: Attribute.UID<'api::industry.industry', 'name'> & Attribute.Required;
    companies: Attribute.Relation<
      'api::industry.industry',
      'oneToMany',
      'api::company.company'
    >;
    ipos: Attribute.Relation<
      'api::industry.industry',
      'oneToMany',
      'api::ipo.ipo'
    >;
    tag: Attribute.Relation<
      'api::industry.industry',
      'oneToOne',
      'api::tag.tag'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::industry.industry',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::industry.industry',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiIpoIpo extends Schema.CollectionType {
  collectionName: 'ipos';
  info: {
    singularName: 'ipo';
    pluralName: 'ipos';
    displayName: 'IPO';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    openDate: Attribute.DateTime & Attribute.Required;
    offerPricePe: Attribute.String & Attribute.Required;
    lastYearSalesGrowth: Attribute.Float & Attribute.Required;
    company: Attribute.Relation<
      'api::ipo.ipo',
      'oneToOne',
      'api::company.company'
    >;
    tag: Attribute.Relation<'api::ipo.ipo', 'oneToOne', 'api::tag.tag'>;
    industry: Attribute.Relation<
      'api::ipo.ipo',
      'manyToOne',
      'api::industry.industry'
    >;
    companyName: Attribute.String & Attribute.Required;
    aboutTheCompany: Attribute.Blocks & Attribute.Required;
    capsuleView: Attribute.Blocks & Attribute.Required;
    slug: Attribute.UID<'api::ipo.ipo', 'companyName'> & Attribute.Required;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    websiteUrl: Attribute.String;
    logo: Attribute.Media & Attribute.Required;
    companyType: Attribute.Relation<
      'api::ipo.ipo',
      'oneToOne',
      'api::company-type.company-type'
    >;
    sector: Attribute.Relation<
      'api::ipo.ipo',
      'oneToOne',
      'api::sector.sector'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::ipo.ipo', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::ipo.ipo', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiIpoZoneIpoZone extends Schema.SingleType {
  collectionName: 'ipo_zones';
  info: {
    singularName: 'ipo-zone';
    pluralName: 'ipo-zones';
    displayName: 'IPO ZONE';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaDescription: Attribute.Text;
    metaTitle: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ipo-zone.ipo-zone',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ipo-zone.ipo-zone',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNewNew extends Schema.CollectionType {
  collectionName: 'news';
  info: {
    singularName: 'new';
    pluralName: 'news';
    displayName: 'New';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    source: Attribute.String;
    url: Attribute.String & Attribute.Required;
    metaTitle: Attribute.String;
    metaDescription: Attribute.String;
    image: Attribute.Media & Attribute.Required;
    slug: Attribute.UID<'api::new.new', 'title'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::new.new', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::new.new', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNotificationNotification extends Schema.CollectionType {
  collectionName: 'notifications';
  info: {
    singularName: 'notification';
    pluralName: 'notifications';
    displayName: 'Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    message: Attribute.Text;
    userId: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOperationDetailOperationDetail
  extends Schema.CollectionType {
  collectionName: 'operation_details';
  info: {
    singularName: 'operation-detail';
    pluralName: 'operation-details';
    displayName: 'operationDetail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    company: Attribute.Relation<
      'api::operation-detail.operation-detail',
      'manyToOne',
      'api::company.company'
    >;
    title: Attribute.String & Attribute.Required;
    value: Attribute.String;
    year: Attribute.Integer;
    month: Attribute.String;
    duration: Attribute.Enumeration<['yearly', 'quarterly']> &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::operation-detail.operation-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::operation-detail.operation-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlanPlan extends Schema.CollectionType {
  collectionName: 'plans';
  info: {
    singularName: 'plan';
    pluralName: 'plans';
    displayName: 'Plan';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    price: Attribute.Float & Attribute.Required;
    features: Attribute.JSON;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    planType: Attribute.String;
    durationInDays: Attribute.Integer & Attribute.Required;
    slug: Attribute.UID<'api::plan.plan', 'name'> & Attribute.Required;
    currency: Attribute.String;
    regularPrice: Attribute.Float & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPrivacyPolicyPrivacyPolicy extends Schema.SingleType {
  collectionName: 'privacy_policies';
  info: {
    singularName: 'privacy-policy';
    pluralName: 'privacy-policies';
    displayName: 'PrivacyPolicy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    description: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProfessionProfession extends Schema.CollectionType {
  collectionName: 'professions';
  info: {
    singularName: 'profession';
    pluralName: 'professions';
    displayName: 'Profession';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::profession.profession',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::profession.profession',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPromoCodePromoCode extends Schema.CollectionType {
  collectionName: 'promo_codes';
  info: {
    singularName: 'promo-code';
    pluralName: 'promo-codes';
    displayName: 'PromoCode';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    code: Attribute.String & Attribute.Required;
    expiryDate: Attribute.DateTime & Attribute.Required;
    maxUsage: Attribute.Integer;
    discountAmount: Attribute.Float & Attribute.Required;
    isActive: Attribute.Boolean & Attribute.DefaultTo<true>;
    availedCount: Attribute.Integer & Attribute.DefaultTo<0>;
    plan: Attribute.Relation<
      'api::promo-code.promo-code',
      'oneToOne',
      'api::plan.plan'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::promo-code.promo-code',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::promo-code.promo-code',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRefundPolicyRefundPolicy extends Schema.SingleType {
  collectionName: 'refund_policies';
  info: {
    singularName: 'refund-policy';
    pluralName: 'refund-policies';
    displayName: 'Refund Policy';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    description: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::refund-policy.refund-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::refund-policy.refund-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiScreenerScreener extends Schema.SingleType {
  collectionName: 'screeners';
  info: {
    singularName: 'screener';
    pluralName: 'screeners';
    displayName: 'Screener';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::screener.screener',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::screener.screener',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSectorSector extends Schema.CollectionType {
  collectionName: 'sectors';
  info: {
    singularName: 'sector';
    pluralName: 'sectors';
    displayName: 'Sector';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::sector.sector', 'name'> & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    companies: Attribute.Relation<
      'api::sector.sector',
      'oneToMany',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sector.sector',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sector.sector',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShareHoldingShareHolding extends Schema.CollectionType {
  collectionName: 'share_holdings';
  info: {
    singularName: 'share-holding';
    pluralName: 'share-holdings';
    displayName: 'ShareHolding';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    company: Attribute.Relation<
      'api::share-holding.share-holding',
      'manyToOne',
      'api::company.company'
    >;
    year: Attribute.String;
    value: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::share-holding.share-holding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::share-holding.share-holding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionSubscription extends Schema.CollectionType {
  collectionName: 'subscriptions';
  info: {
    singularName: 'subscription';
    pluralName: 'subscriptions';
    displayName: 'Subscription';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    expiryDate: Attribute.DateTime;
    isCancel: Attribute.Boolean & Attribute.DefaultTo<false>;
    userId: Attribute.Relation<
      'api::subscription.subscription',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    plan: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'api::plan.plan'
    >;
    paymentDetails: Attribute.JSON;
    paymentStatus: Attribute.Enumeration<['PENDING', 'COMPLETED', 'FAILED']>;
    transactionID: Attribute.String;
    amount: Attribute.Float;
    invoiceUrl: Attribute.String;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    orderId: Attribute.String;
    paymentOrderJson: Attribute.JSON;
    paymentVerifyJson: Attribute.JSON;
    promoCodeId: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'api::promo-code.promo-code'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionButtonSubscriptionButton
  extends Schema.SingleType {
  collectionName: 'subscription_buttons';
  info: {
    singularName: 'subscription-button';
    pluralName: 'subscription-buttons';
    displayName: 'SubscriptionButton';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    plan: Attribute.Relation<
      'api::subscription-button.subscription-button',
      'oneToOne',
      'api::plan.plan'
    >;
    title: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-button.subscription-button',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-button.subscription-button',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSummitSummit extends Schema.CollectionType {
  collectionName: 'summits';
  info: {
    singularName: 'summit';
    pluralName: 'summits';
    displayName: 'Summit';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    thumbnail: Attribute.Media;
    organized_on: Attribute.DateTime &
      Attribute.DefaultTo<'2025-01-23T18:30:00.000Z'>;
    summit_videos: Attribute.Relation<
      'api::summit.summit',
      'oneToMany',
      'api::summit-video.summit-video'
    >;
    price: Attribute.Integer;
    maildata: Attribute.JSON;
    detailposter: Attribute.Media;
    summit_payments: Attribute.Relation<
      'api::summit.summit',
      'oneToMany',
      'api::summit-payment.summit-payment'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::summit.summit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::summit.summit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSummitPaymentSummitPayment extends Schema.CollectionType {
  collectionName: 'summit_payments';
  info: {
    singularName: 'summit-payment';
    pluralName: 'summit-payments';
    displayName: 'Summit payment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::summit-payment.summit-payment',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    summit: Attribute.Relation<
      'api::summit-payment.summit-payment',
      'manyToOne',
      'api::summit.summit'
    >;
    razorpayResponse: Attribute.JSON;
    mail: Attribute.Email;
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::summit-payment.summit-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::summit-payment.summit-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSummitVideoSummitVideo extends Schema.CollectionType {
  collectionName: 'summit_videos';
  info: {
    singularName: 'summit-video';
    pluralName: 'summit-videos';
    displayName: 'Summit Video';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    document: Attribute.Media;
    video: Attribute.Media;
    summit: Attribute.Relation<
      'api::summit-video.summit-video',
      'manyToOne',
      'api::summit.summit'
    >;
    thumbnail: Attribute.Media & Attribute.Required;
    order: Attribute.Integer;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::summit-video.summit-video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::summit-video.summit-video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTagTag extends Schema.CollectionType {
  collectionName: 'tags';
  info: {
    singularName: 'tag';
    pluralName: 'tags';
    displayName: 'Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::tag.tag', 'name'> & Attribute.Required;
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    colorHash: Attribute.String & Attribute.Required;
    buckets: Attribute.Relation<
      'api::tag.tag',
      'oneToMany',
      'api::bucket.bucket'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTermAndConditionTermAndCondition extends Schema.SingleType {
  collectionName: 'term_and_conditions';
  info: {
    singularName: 'term-and-condition';
    pluralName: 'term-and-conditions';
    displayName: 'TermAndCondition';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    description: Attribute.Blocks;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::term-and-condition.term-and-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::term-and-condition.term-and-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTopGainerTopGainer extends Schema.CollectionType {
  collectionName: 'top_gainers';
  info: {
    singularName: 'top-gainer';
    pluralName: 'top-gainers';
    displayName: 'topGainer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.Float & Attribute.Required;
    company: Attribute.Relation<
      'api::top-gainer.top-gainer',
      'oneToOne',
      'api::company.company'
    >;
    exchangeType: Attribute.Enumeration<['NSE', 'BSE']> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::top-gainer.top-gainer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::top-gainer.top-gainer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTopLoserTopLoser extends Schema.CollectionType {
  collectionName: 'top_losers';
  info: {
    singularName: 'top-loser';
    pluralName: 'top-losers';
    displayName: 'TopLoser';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.Float & Attribute.Required;
    company: Attribute.Relation<
      'api::top-loser.top-loser',
      'oneToOne',
      'api::company.company'
    >;
    exchangeType: Attribute.Enumeration<['NSE', 'BSE']> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::top-loser.top-loser',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::top-loser.top-loser',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWachlistWachlist extends Schema.SingleType {
  collectionName: 'wachlists';
  info: {
    singularName: 'wachlist';
    pluralName: 'wachlists';
    displayName: 'Wachlist';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    metaTitle: Attribute.String;
    metaDescription: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::wachlist.wachlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::wachlist.wachlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWishlistWishlist extends Schema.CollectionType {
  collectionName: 'wishlists';
  info: {
    singularName: 'wishlist';
    pluralName: 'wishlists';
    displayName: 'Wishlist';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    userId: Attribute.Relation<
      'api::wishlist.wishlist',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    companyId: Attribute.Relation<
      'api::wishlist.wishlist',
      'oneToOne',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::wishlist.wishlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::wishlist.wishlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::about-us.about-us': ApiAboutUsAboutUs;
      'api::bucket.bucket': ApiBucketBucket;
      'api::business-segment.business-segment': ApiBusinessSegmentBusinessSegment;
      'api::capsuleplus.capsuleplus': ApiCapsuleplusCapsuleplus;
      'api::category.category': ApiCategoryCategory;
      'api::company.company': ApiCompanyCompany;
      'api::company-share-detail.company-share-detail': ApiCompanyShareDetailCompanyShareDetail;
      'api::company-share-price.company-share-price': ApiCompanySharePriceCompanySharePrice;
      'api::company-type.company-type': ApiCompanyTypeCompanyType;
      'api::company-type-detail.company-type-detail': ApiCompanyTypeDetailCompanyTypeDetail;
      'api::compnay-timeline.compnay-timeline': ApiCompnayTimelineCompnayTimeline;
      'api::contact-us.contact-us': ApiContactUsContactUs;
      'api::disclaimer.disclaimer': ApiDisclaimerDisclaimer;
      'api::feed.feed': ApiFeedFeed;
      'api::financial-highlight.financial-highlight': ApiFinancialHighlightFinancialHighlight;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::index.index': ApiIndexIndex;
      'api::industry.industry': ApiIndustryIndustry;
      'api::ipo.ipo': ApiIpoIpo;
      'api::ipo-zone.ipo-zone': ApiIpoZoneIpoZone;
      'api::new.new': ApiNewNew;
      'api::notification.notification': ApiNotificationNotification;
      'api::operation-detail.operation-detail': ApiOperationDetailOperationDetail;
      'api::plan.plan': ApiPlanPlan;
      'api::privacy-policy.privacy-policy': ApiPrivacyPolicyPrivacyPolicy;
      'api::profession.profession': ApiProfessionProfession;
      'api::promo-code.promo-code': ApiPromoCodePromoCode;
      'api::refund-policy.refund-policy': ApiRefundPolicyRefundPolicy;
      'api::screener.screener': ApiScreenerScreener;
      'api::sector.sector': ApiSectorSector;
      'api::share-holding.share-holding': ApiShareHoldingShareHolding;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::subscription-button.subscription-button': ApiSubscriptionButtonSubscriptionButton;
      'api::summit.summit': ApiSummitSummit;
      'api::summit-payment.summit-payment': ApiSummitPaymentSummitPayment;
      'api::summit-video.summit-video': ApiSummitVideoSummitVideo;
      'api::tag.tag': ApiTagTag;
      'api::term-and-condition.term-and-condition': ApiTermAndConditionTermAndCondition;
      'api::top-gainer.top-gainer': ApiTopGainerTopGainer;
      'api::top-loser.top-loser': ApiTopLoserTopLoser;
      'api::wachlist.wachlist': ApiWachlistWachlist;
      'api::wishlist.wishlist': ApiWishlistWishlist;
    }
  }
}
