"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-22 19:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password_hash', sa.String(length=256), nullable=False),
        sa.Column('phone', sa.String(length=15), nullable=False),
        sa.Column('role', sa.Enum('DRIVER', 'CUSTOMER', name='userrole'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('vehicle_number', sa.String(length=30), nullable=True),
        sa.Column('truck_type', sa.String(length=50), nullable=True),
        sa.Column('truck_capacity', sa.String(length=50), nullable=True),
        sa.Column('company_name', sa.String(length=100), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Route Listings table
    op.create_table(
        'route_listings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('driver_id', sa.Integer(), nullable=False),
        sa.Column('origin', sa.String(length=200), nullable=False),
        sa.Column('destination', sa.String(length=200), nullable=False),
        sa.Column('origin_lat', sa.Float(), nullable=False),
        sa.Column('origin_lng', sa.Float(), nullable=False),
        sa.Column('dest_lat', sa.Float(), nullable=False),
        sa.Column('dest_lng', sa.Float(), nullable=False),
        sa.Column('departure_date', sa.DateTime(), nullable=False),
        sa.Column('distance_km', sa.Float(), nullable=False),
        sa.Column('truck_type', sa.String(length=50), nullable=False),
        sa.Column('truck_capacity', sa.String(length=50), nullable=False),
        sa.Column('available_space', sa.String(length=100), nullable=False),
        sa.Column('rate_per_km', sa.Float(), nullable=False),
        sa.Column('flat_rate', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('ACTIVE', 'COMPLETED', 'CANCELLED', name='routestatus'), nullable=False),
        sa.Column('contact_phone', sa.String(length=15), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['driver_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_route_listings_id'), 'route_listings', ['id'], unique=False)
    op.create_index(op.f('ix_route_listings_driver_id'), 'route_listings', ['driver_id'], unique=False)
    op.create_index(op.f('ix_route_listings_origin'), 'route_listings', ['origin'], unique=False)
    op.create_index(op.f('ix_route_listings_destination'), 'route_listings', ['destination'], unique=False)
    op.create_index(op.f('ix_route_listings_departure_date'), 'route_listings', ['departure_date'], unique=False)
    op.create_index(op.f('ix_route_listings_status'), 'route_listings', ['status'], unique=False)
    op.create_index('ix_route_origin_dest', 'route_listings', ['origin', 'destination'], unique=False)

    # Bookings table
    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('route_id', sa.Integer(), nullable=False),
        sa.Column('pickup_location', sa.String(length=200), nullable=False),
        sa.Column('drop_location', sa.String(length=200), nullable=False),
        sa.Column('goods_description', sa.String(length=500), nullable=False),
        sa.Column('estimated_weight', sa.String(length=50), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', name='bookingstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['route_id'], ['route_listings.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_bookings_id'), 'bookings', ['id'], unique=False)
    op.create_index(op.f('ix_bookings_customer_id'), 'bookings', ['customer_id'], unique=False)
    op.create_index(op.f('ix_bookings_route_id'), 'bookings', ['route_id'], unique=False)
    op.create_index(op.f('ix_bookings_status'), 'bookings', ['status'], unique=False)
    op.create_index('ix_booking_customer_route', 'bookings', ['customer_id', 'route_id'], unique=False)


def downgrade() -> None:
    op.drop_table('bookings')
    op.drop_table('route_listings')
    op.drop_table('users')
