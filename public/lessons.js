// Lesson content, shared by browser and server (server uses it to validate attempts and name lessons in exports).
// `art` names a file in public/art/ (Fluent Emoji, MIT). `crayon` is the stage colour: red|orange|yellow|green|blue|purple.
// A label is either a string or { text, art } (art-only cards work for children who cannot read yet).
// Challenge types:
//   quiz:   { q, art?, options: [label..], answer: index }
//   drag:   { q, targets: [{ key, label }], items: [{ label, target: key }] }  (matching, or ordering into numbered slots)
//   memory: { q, pairs: [[label, label], ...] }  flip cards to find matching pairs
export const LESSONS = [
  {
    id: 'k3-b1', grade: 3, title: 'Thông tin quanh em', art: 'light_bulb', crayon: 'yellow',
    blurb: 'Nhìn, nghe và quyết định',
    summary: [
      ['eyes', 'Em nhận biết thông tin qua <b>mắt</b> (nhìn) và <b>tai</b> (nghe).'],
      ['memo', 'Thông tin có 3 dạng: <b>chữ</b>, <b>hình ảnh</b>, <b>âm thanh</b>.'],
      ['brain', 'Bộ não <b>xử lí thông tin</b> giúp em đưa ra <b>quyết định</b>.'],
      ['vertical_traffic_light', 'Ví dụ: thấy đèn đỏ thì em <b>dừng lại</b>.'],
    ],
    challenges: [
      { type: 'quiz', art: 'vertical_traffic_light', q: 'Đèn giao thông chuyển sang màu đỏ. Em sẽ làm gì?', options: ['Đi tiếp thật nhanh', 'Dừng lại chờ', 'Quay về nhà'], answer: 1 },
      { type: 'quiz', art: 'bell', q: 'Tiếng trống trường là thông tin dạng nào?', options: ['Chữ', 'Hình ảnh', 'Âm thanh'], answer: 2 },
      { type: 'drag', q: 'Đưa mỗi thông tin vào đúng dạng của nó',
        targets: [{ key: 'chu', label: { text: 'Chữ', art: 'memo' } }, { key: 'hinh', label: { text: 'Hình ảnh', art: 'framed_picture' } }, { key: 'am', label: { text: 'Âm thanh', art: 'musical_note' } }],
        items: [{ label: 'Bài hát', target: 'am' }, { label: 'Bức tranh', target: 'hinh' }, { label: 'Trang truyện', target: 'chu' }] },
      { type: 'memory', q: 'Lật thẻ: ghép thông tin với quyết định', pairs: [
        [{ text: 'Trời sắp mưa', art: 'cloud_with_rain' }, { text: 'Mang ô', art: 'umbrella' }],
        [{ text: 'Chuông báo thức', art: 'alarm_clock' }, { text: 'Thức dậy', art: 'bed' }],
        [{ text: 'Đèn xanh', art: 'vertical_traffic_light' }, { text: 'Sang đường', art: 'person_walking' }]] },
      { type: 'quiz', art: 'brain', q: 'Bộ phận nào giúp em xử lí thông tin?', options: ['Bộ não', 'Bàn tay', 'Cái mũi'], answer: 0 },
    ],
  },
  {
    id: 'k3-b2', grade: 3, title: 'Máy tính – người bạn mới', art: 'desktop_computer', crayon: 'blue',
    blurb: 'Màn hình, bàn phím, chuột, thân máy',
    summary: [
      ['desktop_computer', '<b>Màn hình</b>: hiển thị chữ và hình ảnh.'],
      ['package', '<b>Thân máy</b>: chứa bộ xử lí, là "bộ não" của máy tính.'],
      ['keyboard', '<b>Bàn phím</b>: dùng để gõ chữ và số.'],
      ['computer_mouse', '<b>Chuột</b>: dùng để chọn và điều khiển.'],
    ],
    challenges: [
      { type: 'drag', q: 'Đưa tên bộ phận vào đúng công dụng',
        targets: [{ key: 'mh', label: 'Hiển thị hình ảnh' }, { key: 'bp', label: 'Gõ chữ và số' }, { key: 'ch', label: 'Chọn và điều khiển' }, { key: 'tm', label: 'Xử lí thông tin' }],
        items: [{ label: { text: 'Màn hình', art: 'desktop_computer' }, target: 'mh' }, { label: { text: 'Bàn phím', art: 'keyboard' }, target: 'bp' },
          { label: { text: 'Chuột', art: 'computer_mouse' }, target: 'ch' }, { label: { text: 'Thân máy', art: 'package' }, target: 'tm' }] },
      { type: 'quiz', art: 'computer_mouse', q: 'Thiết bị nào em cầm tay để di chuyển con trỏ?', options: ['Bàn phím', 'Chuột', 'Loa'], answer: 1 },
      { type: 'quiz', art: 'laptop', q: 'Máy tính xách tay còn được gọi là gì?', options: ['Laptop', 'Máy in', 'Ti vi'], answer: 0 },
      { type: 'memory', q: 'Lật thẻ: ghép hình với tên thiết bị', pairs: [
        [{ art: 'desktop_computer' }, 'Màn hình'], [{ art: 'keyboard' }, 'Bàn phím'], [{ art: 'computer_mouse' }, 'Chuột'], [{ art: 'printer' }, 'Máy in']] },
      { type: 'quiz', art: 'package', q: 'Bộ phận nào được ví như "bộ não" của máy tính?', options: ['Màn hình', 'Thân máy', 'Chuột'], answer: 1 },
    ],
  },
  {
    id: 'k3-b3', grade: 3, title: 'Làm việc an toàn với máy tính', art: 'shield', crayon: 'green',
    blurb: 'Ngồi đúng, đủ sáng, tránh điện',
    summary: [
      ['chair', 'Ngồi <b>thẳng lưng</b>, mắt cách màn hình khoảng <b>50–80 cm</b>.'],
      ['light_bulb', 'Phòng học đủ <b>ánh sáng</b>, không để nắng chiếu vào màn hình.'],
      ['high_voltage', '<b>Không chạm</b> vào ổ điện, dây điện. Tay phải <b>khô</b>.'],
      ['electric_plug', 'Bật máy: nguồn điện → thân máy → màn hình. Tắt máy bằng nút <b>Shut down</b>.'],
    ],
    challenges: [
      { type: 'quiz', art: 'chair', q: 'Khi ngồi máy tính, em nên ngồi thế nào?', options: ['Cúi sát màn hình', 'Thẳng lưng, mắt cách màn hình vừa phải', 'Nằm trên ghế'], answer: 1 },
      { type: 'drag', q: 'Xếp các bước bật máy tính theo đúng thứ tự',
        targets: [{ key: '1', label: 'Bước 1' }, { key: '2', label: 'Bước 2' }, { key: '3', label: 'Bước 3' }],
        items: [{ label: { text: 'Bật nguồn điện', art: 'electric_plug' }, target: '1' }, { label: { text: 'Nhấn nút nguồn thân máy', art: 'package' }, target: '2' },
          { label: { text: 'Bật màn hình', art: 'desktop_computer' }, target: '3' }] },
      { type: 'quiz', art: 'high_voltage', q: 'Việc nào KHÔNG an toàn?', options: ['Lau khô tay trước khi dùng máy', 'Cắm tay vào ổ điện', 'Ngồi đúng tư thế'], answer: 1 },
      { type: 'memory', q: 'Lật thẻ: ghép việc làm với lí do', pairs: [
        [{ text: 'Ngồi thẳng', art: 'chair' }, 'Không đau lưng'], [{ text: 'Đủ ánh sáng', art: 'light_bulb' }, 'Bảo vệ mắt'], [{ text: 'Tay khô', art: 'droplet' }, 'Tránh điện giật']] },
      { type: 'quiz', art: 'electric_plug', q: 'Cách tắt máy tính đúng là gì?', options: ['Rút phích điện', 'Chọn Start rồi Shut down', 'Tắt màn hình là xong'], answer: 1 },
    ],
  },
];
