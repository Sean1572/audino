"""empty message

Revision ID: d9bcb2994190
Revises: 123ewrwerwe
Create Date: 2020-12-01 11:54:49.732903

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'd9bcb2994190'
down_revision = '123ewrwerwe'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('data', 'created_at',
               existing_type=mysql.DATETIME(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('data', 'created_at',
               existing_type=mysql.DATETIME(),
               nullable=True)
    # ### end Alembic commands ###