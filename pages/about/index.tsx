import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { Card, EventTitle, Logo, Background, Footer } from '@Components';

const About: NextPage = () => (
  <Background>
    <Card>
      <p className="tag light-font">从一首诗开始</p>
      <EventTitle>关于浪潮</EventTitle>
      <p>
        当下的社会事件在打一场擂台赛，今天是「百度魏则西」赢得万众瞩目，明天是「人大硕士雷洋」站上冠军台。被人们热切关注的事件如虎添翼，很快有积极进展。可一旦有「新生代实力小将」登场，便立刻成为委地黄花。失去公众关注的事件寸步难行，甚至节节败退
        —— 回想一下，你曾关注的社会事件中，有多少得到了妥善的解决？
      </p>
      <p>
        浪潮，不仅是一个新闻聚合网站，更是你的小闹钟。在你忙于追随最新社会热点时，它会悄悄提醒你：「嘿，你关注的雷洋事件已经有半个月没有新的消息了，快去看看现状如何。」通过浪潮，你可以：
      </p>
      <ol>
        <li>获取一个事件的新闻合辑</li>
        <li>关注一个事件并根据设定获得事件推送</li>
        <li>自行添加新的新闻至事件页面</li>
      </ol>
      <p>
        浪潮，正是这样一个小闹钟。它帮你记住一个事件，关注一个事件，推动一个事件。席慕蓉曾在诗中写道：「溪水急着要流向海洋，浪潮却渴望重回土地」。在一片嘈杂声中，一个事件盖过另一个事件，一阵喧嚣闹过另一阵喧嚣。我们可以选择像溪水一样，裹挟在舆论热点中随波逐流，却不知正去向何方。也可以选择成为浪潮：永远看准一个方向，永远不忘朝土地奔跑。
      </p>
      <p>浪潮，或许此刻退下沙滩，可我们知道，它终将重回土地。</p>
      <div className="image-container">
        <Link href="/">
          <a href="/">
            <Logo mode="simple" height={24} />
          </a>
        </Link>
      </div>
    </Card>
    <Footer />
    <style jsx>
      {`
        p,
        ol {
          margin-top: 0.75rem;
          line-height: 1.8;
        }

        .tag {
          line-height: 1;
        }

        .image-container {
          display: flex;
          justify-content: flex-end;
          margin: 1rem 1rem 1.5rem 1rem;
        }

        .image-container * {
          height: 1.5rem;
        }
      `}
    </style>
  </Background>
);

export default About;
