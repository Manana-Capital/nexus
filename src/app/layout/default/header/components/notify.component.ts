import { Component } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';

@Component({
  selector: 'header-notify',
  template: `
  <notice-icon
    [data]="data"
    [count]="count"
    [loading]="loading"
    (select)="select($event)"
    (clear)="clear($event)"
    (popoverVisibleChange)="loadData()"></notice-icon>
  `,
})
export class HeaderNotifyComponent {
  data: NoticeItem[] = [
    {
      title: 'Notice',
      list: [],
      emptyText: 'You have viewed all notifications',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: 'Clear notification',
    },
    {
      title: 'News',
      list: [],
      emptyText: 'You have read all the messages',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: 'Clear message',
    },
    {
      title: 'Upcoming',
      list: [],
      emptyText: 'You have completed all the to-do',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: 'Empty to-do',
    },
  ];
  count = 0;
  loading = false;

  constructor(private msg: NzMessageService) {}

  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem = { ...item };
      if (newItem.datetime)
        newItem.datetime = distanceInWordsToNow(item.datetime, {
          locale: (window as any).__locale__,
        });
      if (newItem.extra && newItem.status) {
        newItem.color = {
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newItem.status];
      }
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData() {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      this.data = this.updateNoticeData([
        {
          id: '000000001',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: 'You received 14 new weekly newspapers',
          datetime: '2017-08-09',
          type: 'Notice',
        },
        {
          id: '000000002',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: 'Your recommended Alice has passed the third round of interviews.',
          datetime: '2017-08-08',
          type: 'Notice',
        },
        {
          id: '000000003',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: 'This template can distinguish between multiple notification types',
          datetime: '2017-08-07',
          read: true,
          type: 'Notice',
        },
        {
          id: '000000004',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: 'The left icon is used to distinguish between different types',
          datetime: '2017-08-07',
          type: 'Notice',
        },
        {
          id: '000000005',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: 'Do not exceed two lines of content, automatically cut off when exceeded',
          datetime: '2017-08-07',
          type: 'Notice',
        },
        {
          id: '000000006',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: 'Qu Lili commented on you',
          description: 'Description information description information description information',
          datetime: '2017-08-07',
          type: 'News',
        },
        {
          id: '000000007',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: 'Zhu is right, I replied to you.',
          description: 'This template is used to remind people who have interacted with you.',
          datetime: '2017-08-07',
          type: 'News',
        },
        {
          id: '000000008',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: 'Title',
          description: 'This template is used to remind people who have interacted with you.',
          datetime: '2017-08-07',
          type: 'News',
        },
        {
          id: '000000009',
          title: 'Misson name',
          description: 'The mission needs to be started before 2017-01-12 20:00',
          extra: 'Nas not started yet',
          status: 'todo',
          type: 'Upcoming',
        },
        {
          id: '000000010',
          title: 'Third-party emergency code change',
          description:
            'Guan Lin submitted on 2017-01-06, need to complete the code change task before 2017-01-07',
          extra: 'Expire immediately',
          status: 'urgent',
          type: 'Upcoming',
        },
        {
          id: '000000011',
          title: 'Information security exam',
          description: 'Appointed Zhuer to complete the update and release before 2017-01-09',
          extra: 'It took 8 days',
          status: 'doing',
          type: 'Upcoming',
        },
        {
          id: '000000012',
          title: '1.0 version released',
          description:
            'Guan Lin submitted on 2017-01-06, need to complete the code change task before 2017-01-07',
          extra: 'Processing',
          status: 'processing',
          type: 'Upcoming',
        },
      ]);

      this.loading = false;
    }, 1000);
  }

  clear(type: string) {
    this.msg.success(`Cleared ${type}`);
  }

  select(res: any) {
    this.msg.success(`Clicked ${res.title} of ${res.item.title}`);
  }
}
