import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';
const ReceivingTransaction = sequelize.define('ReceivingTransaction', {
  id_penerimaan: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  Referensi: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  nomor_dokumen_penerimaan: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  tanggal_penerimaan: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_pegawai_gudang: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user',
    },
  },
}, {
  tableName: 'receiving_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

import moment from 'moment';

ReceivingTransaction.beforeCreate(async (receivingTransaction, options) => {
  // Generate id_penerimaan as before
  const prefix = 'RCVT-';
  const lastTransaction = await ReceivingTransaction.findOne({
    where: {
      id_penerimaan: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['id_penerimaan', 'DESC']],
  });
  if (lastTransaction) {
    const lastIdNum = parseInt(lastTransaction.id_penerimaan.replace(prefix, ''), 10);
    const newIdNum = lastIdNum + 1;
    receivingTransaction.id_penerimaan = prefix + newIdNum.toString().padStart(3, '0');
  } else {
    receivingTransaction.id_penerimaan = prefix + '001';
  }

  // Generate nomor_dokumen_penerimaan as DPB-yyyymmdd-001 reset daily
  const datePrefix = moment().format('YYYYMMDD');
  const likePattern = `DPB-${datePrefix}-%`;

  const lastDoc = await ReceivingTransaction.findOne({
    where: {
      nomor_dokumen_penerimaan: {
        [Op.like]: likePattern
      }
    },
    order: [['nomor_dokumen_penerimaan', 'DESC']],
  });

  if (lastDoc && lastDoc.nomor_dokumen_penerimaan) {
    const lastSeq = parseInt(lastDoc.nomor_dokumen_penerimaan.slice(-3), 10);
    const newSeq = (lastSeq + 1).toString().padStart(3, '0');
    receivingTransaction.nomor_dokumen_penerimaan = `DPB-${datePrefix}-${newSeq}`;
  } else {
    receivingTransaction.nomor_dokumen_penerimaan = `DPB-${datePrefix}-001`;
  }

  // Generate Referensi as REF-yyyymmdd reset daily
  receivingTransaction.Referensi = `REF-${datePrefix}`;
});

export default ReceivingTransaction;
