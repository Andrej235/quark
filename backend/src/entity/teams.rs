//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.13

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "teams")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    #[sea_orm(column_type = "Text")]
    pub name: String,
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::team_invitations::Entity")]
    TeamInvitations,
    #[sea_orm(has_many = "super::team_members::Entity")]
    TeamMembers,
    #[sea_orm(has_many = "super::team_roles::Entity")]
    TeamRoles,
    #[sea_orm(has_many = "super::users::Entity")]
    Users,
}

impl Related<super::team_invitations::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TeamInvitations.def()
    }
}

impl Related<super::team_members::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TeamMembers.def()
    }
}

impl Related<super::team_roles::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TeamRoles.def()
    }
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
