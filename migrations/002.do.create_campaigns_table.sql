create table campaigns (
    id integer primary key generated by default as identity,
    campaign_name text not null,
    players integer default 1,
    active_since TIMESTAMPTZ default now() not null,
    active boolean default true not null,
    private_campaign boolean default false not null,
    admin integer references users(id) on delete cascade not null
);