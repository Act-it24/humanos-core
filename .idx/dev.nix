{ pkgs, ... }: {
  # نستخدم قناة ثابتة حديثة
  channel = "stable-24.05";

  # الباكدجات السيستيم اللي البيئة محتاجاها (Node علشان Vite/React)
  packages = [
    pkgs.nodejs_20
  ];

  # متغيّرات بيئة عامة (لسه مش محتاجين حاجة هنا)
  env = { };

  idx = {
    # لو حبيت تضيف لاحقًا Extensions للـ IDE تقدر تحطها هنا
    extensions = [
      # "vscodevim.vim"
    ];

    # إعدادات الـ previews
    previews = {
      enable = true;
      previews = {
        web = {
          # نخلي Firebase Studio يشغّل سيرفر Vite
          command = [
            "npm"
            "run"
            "dev"
            "--"
            "--port"
            "$PORT"
            "--host"
            "0.0.0.0"
          ];
          manager = "web";
          # مهم جدًا: مشروع React موجود في فولدر web/
          cwd = "web";
        };
      };
    };

    workspace = {
      onCreate = {
        # ممكن بعدين نحط هنا:
        # npm-install = "cd web && npm install";
      };
      onStart = {
        # أو أوامر background لو احتجنا
      };
    };
  };
}
